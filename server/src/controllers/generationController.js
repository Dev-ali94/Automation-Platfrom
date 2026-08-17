import openRouter from "../services/openRouter.js";
import { cloudinary } from "../config/Cloudinary.js";
import { Generation } from "../models/Generation.js";
import {Post} from "../models/Post.js"

export const createGeneration = async (req, res) => {
    const user = req.user;
    try {
        const { promt, tone } = req.body;
        if (!promt) {
            return res.status(400).json({success: false,message: "Prompt is required"});
        }
        const completion = await openRouter.chat.completions.create({
            model: "openai/gpt-oss-120b",
            messages: [
                {
                    role: "user",
                    content: `Create a social media post based on the following: Prompt: ${promt} Tone: ${tone || "professional"} Include relevant hashtags.Return valid Json in Form "content`,
                },
            ],
        });

        const responseContent = completion.choices?.[0]?.message?.content?.trim() || "";
        let parsedResponse;
        try {
            parsedResponse = JSON.parse(responseContent);
        } catch (error) {
            parsedResponse = {content: responseContent};
        }
        const content = parsedResponse.content;
        const generations = await Generation.create({
            user: user._id,
            promt,
            content:content,
            tone: tone || "professional",
        });

        // Send final response
        return res.status(200).json({success: true, generations});

    } catch (error) {
        console.error("Error in generatePost:", error);
        return res.status(500).json({ success: false,message: "Failed to generate post",error: error.message});
    }
};


export const getGenerationData = async (req,res) => {
    const user = req.user
    try {
        const generations = await Generation.find({user:req.user._id}).sort({createdAt:-1})
        res.json({success:true,message:"Geeration fetched successfully",generations})
    } catch (error) {
          return res.status(500).json({ success: false,message: "Failed to fetch post",error: error.message});
    }
}







export const createPostFromGeneration = async (req, res) => {
    try {
        const user = req.user;

        const {
            generationId,
            scheduledFor,
            platform
        } = req.body;

        // Validate required fields
        if (!generationId) {
            return res.status(400).json({
                success: false,
                message: "Generation ID is required"
            });
        }

        if (!scheduledFor) {
            return res.status(400).json({
                success: false,
                message: "Scheduled date is required"
            });
        }

        if (!platform) {
            return res.status(400).json({
                success: false,
                message: "Platform is required"
            });
        }

        // Find generation belonging to logged-in user
        const generation = await Generation.findOne({
            _id: generationId,
            user: user._id
        });

        if (!generation) {
            return res.status(404).json({
                success: false,
                message: "Generation not found"
            });
        }

        // Parse platform
        let parsedPlatform = platform;

        if (typeof platform === "string") {
            try {
                parsedPlatform = JSON.parse(platform);
            } catch (error) {
                parsedPlatform = platform.split(",").map(p => p.trim());
            }
        }

        let mediaUrl = req.body.mediaUrl || null;
        let mediaType = req.body.mediaType || null;

        // Upload media if provided
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    {
                        resource_type: "auto",
                        folder: "Social-Scheduler"
                    },
                    (error, result) => {
                        if (error) {
                            reject(error);
                        } else {
                            resolve(result);
                        }
                    }
                );

                stream.end(req.file.buffer);
            });

            mediaUrl = result.secure_url;

            mediaType =
                result.resource_type === "video"
                    ? "video"
                    : "image";
        }

        // Create post using generated content
        const post = await Post.create({
            user: user._id,

            // Get content directly from Generation
            content: generation.content,

            platform: parsedPlatform,

            mediaUrl,
            mediaType,

            scheduledFor,

            status: "scheduled",

            // Optional: keep reference to original generation
            generation: generation._id
        });

        return res.status(201).json({
            success: true,
            message: "Post scheduled successfully",
            post
        });

    } catch (error) {
        console.error("createPostFromGeneration error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create scheduled post",
            error: error.message
        });
    }
};