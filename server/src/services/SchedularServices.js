import cron from "node-cron";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../models/ActivityLog.js";


const cleanMediaUrl = (url) => {
    if (!url) {
        return null;
    }
    let cleanUrl = String(url).trim()
    const markdownMatch = cleanUrl.match(/\[https?:\/\/[^\]]+\]\((https?:\/\/[^)]+)\)/);
    if (markdownMatch) {
        cleanUrl = markdownMatch[1];
    }

    if (cleanUrl.includes("[") || cleanUrl.includes("](")) {
        const urlMatch = cleanUrl.match(/https?:\/\/[^\s\])]+/);
        if (urlMatch) {
            cleanUrl = urlMatch[0];
        }
    }
    cleanUrl = cleanUrl
        .replace(/^["']+|["']+$/g, "")
        .trim();

    return cleanUrl || null;
};

export const initSchedular = () => {
    cron.schedule("* * * * *", async () => {
        try {
            const now = new Date();
            const postsToPublished = await Post.find({
                status: "scheduled",
                scheduledFor: {$lte: now}
            });

            for (const post of postsToPublished) {
                try {
                    const platforms = Array.isArray(post.platform) ? post.platform: [post.platform];
                    const validPlatforms = platforms.filter(Boolean)

                    if (validPlatforms.length === 0) {
                        throw new Error("No platform selected for this post");
                    }


                    const accounts = await Account.find({
                        user: post.user,
                        platform: {$in: validPlatforms,},
                        status: "connected",
                        zernioAccountId: {$exists: true,$ne: null},
                    });

                    if (accounts.length === 0) {
                        throw new Error("No connected Zernio account found")
                    }

                    const zernioPlatforms = accounts.map((account) => ({platform: account.platform,accountId:account.zernioAccountId,}))
                    
                    const originalMediaUrl = post.mediaUrl;

                    const mediaUrl = cleanMediaUrl(originalMediaUrl);

                    const hasInstagram =zernioPlatforms.some((item) =>item.platform.toLowerCase() ==="instagram")
                    if (hasInstagram &&!mediaUrl) {
                        throw new Error("Instagram requires an image or video");
                    }

                    const payload = {
                        content: post.content || "",
                        publishNow: true,
                        platforms:zernioPlatforms,
                        ...(mediaUrl ? {mediaItems: [{type:post.mediaType || "image",url: mediaUrl},]}: {}),
                    }

                    const response =await zernio.posts.createPost({body: payload,});

                    const publishedPost = response?.data?.post || response?.data;

                    if (!publishedPost) {
                        throw new Error("Zernio did not return a published post");
                    }
                    post.status = "published";
                    await post.save();
                    try {
                        await ActivityLog.create({
                            user: post.user,
                            actionType:"POST_PUBLISHED",
                            description:`Published post to ${accounts.map((account) => account.platform).join(", ")}`,
                            relatedPost:post._id,
                        });
                    } catch (activityError) {
                        throw new Error("Activity log error:",activityError);
                    }

                } catch (error) {

                    try {
                        post.status = "failed";
                        await post.save();
                    } catch (saveError) {
                        throw new Error("Failed to update post status:",saveError)
                    }
                    // Activity log
                    try {
                        await ActivityLog.create({
                            user: post.user,
                            actionType: "POST_PUBLISH_FAILED",
                            description:`Failed to publish post: ${error?.message || "Unknown error"}`,
                            relatedPost:
                            post._id,
                        });
                    } catch (activityError) {
                        throw new Error("Failed activity log:",activityError);
                    }
                }
            }

        } catch (error) {
            throw new Error("Scheduler error:",error);
        }
    });
};

export default initSchedular;