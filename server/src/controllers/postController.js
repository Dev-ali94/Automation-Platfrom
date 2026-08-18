import { cloudinary } from "../config/Cloudinary.js";
import { Post } from "../models/Post.js";

export const schedulePost = async (req, res) => {
    try {
        const {scheduledFor,content,platform} = req.body;
        // Platform should be a single string
        let parsedPlatform = platform
        if (typeof platform === "string") {
            try {
                parsedPlatform = JSON.parse(platform)
            } catch (e) {
                parsedPlatform = platform.split(",")
            }
        }

        let mediaUrl = req.body.mediaUrl;
        let mediaType = req.body.mediaType;

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

        const post = await Post.create({
            user: req.user._id,
            content,
            platform: parsedPlatform,
            mediaUrl,
            mediaType,
            scheduledFor,
            status: "scheduled"
        });

        return res.status(201).json({
            message: "Post created successfully",
            success: true,
            post
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to schedule post",
            error: error.message
        });
    }
};

export const getPostData = async (req,res) => {
    try {
        const posts = await Post.find({user:req.user._id})
        res.json({success:true,message:"Post fetched successfully",posts})
    } catch (error) {
          return res.status(500).json({ success: false,message: "Failed to fetch post",error: error.message});
    }
}
