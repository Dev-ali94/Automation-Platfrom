import cron from "node-cron";
import { Post } from "../models/Post.js";
import { Account } from "../models/Account.js";
import zernio from "../config/zernio.js";
import { ActivityLog } from "../models/ActivityLog.js";

/**
 * Clean media URL
 *
 * Converts:
 *
 * [https://example.com/image.png](https://example.com/image.png)
 *
 * into:
 *
 * https://example.com/image.png
 */
const cleanMediaUrl = (url) => {
    if (!url) {
        return null;
    }

    let cleanUrl = String(url).trim();

    // Extract URL from Markdown link
    const markdownMatch = cleanUrl.match(
        /\[https?:\/\/[^\]]+\]\((https?:\/\/[^)]+)\)/
    );

    if (markdownMatch) {
        cleanUrl = markdownMatch[1];
    }

    // If there is still markdown formatting,
    // try to extract the first URL
    if (cleanUrl.includes("[") || cleanUrl.includes("](")) {
        const urlMatch = cleanUrl.match(
            /https?:\/\/[^\s\])]+/
        );

        if (urlMatch) {
            cleanUrl = urlMatch[0];
        }
    }

    // Remove quotes
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
                scheduledFor: {
                    $lte: now,
                },
            });

            for (const post of postsToPublished) {
                try {
                    // ==========================================
                    // GET PLATFORMS
                    // ==========================================

                    const platforms = Array.isArray(post.platform)
                        ? post.platform
                        : [post.platform];

                    const validPlatforms = platforms.filter(
                        Boolean
                    );

                    if (validPlatforms.length === 0) {
                        throw new Error(
                            "No platform selected for this post"
                        );
                    }

                    // ==========================================
                    // GET CONNECTED ACCOUNTS
                    // ==========================================

                    const accounts = await Account.find({
                        user: post.user,
                        platform: {
                            $in: validPlatforms,
                        },
                        status: "connected",
                        zernioAccountId: {
                            $exists: true,
                            $ne: null,
                        },
                    });

                    if (accounts.length === 0) {
                        throw new Error(
                            "No connected Zernio account found"
                        );
                    }

                    // ==========================================
                    // ZERNIO PLATFORMS
                    // ==========================================

                    const zernioPlatforms = accounts.map(
                        (account) => ({
                            platform: account.platform,
                            accountId:
                                account.zernioAccountId,
                        })
                    );

                    // ==========================================
                    // CLEAN MEDIA URL
                    // ==========================================

                    const originalMediaUrl =
                        post.mediaUrl;

                    const mediaUrl = cleanMediaUrl(
                        originalMediaUrl
                    );

                    console.log(
                        "================================="
                    );

                    console.log(
                        "Original Media URL:",
                        originalMediaUrl
                    );

                    console.log(
                        "Clean Media URL:",
                        mediaUrl
                    );

                    // ==========================================
                    // CHECK INSTAGRAM MEDIA
                    // ==========================================

                    const hasInstagram =
                        zernioPlatforms.some(
                            (item) =>
                                item.platform.toLowerCase() ===
                                "instagram"
                        );

                    if (
                        hasInstagram &&
                        !mediaUrl
                    ) {
                        throw new Error(
                            "Instagram requires an image or video"
                        );
                    }

                    // ==========================================
                    // BUILD ZERNIO PAYLOAD
                    // ==========================================

                    const payload = {
                        content: post.content || "",

                        publishNow: true,

                        platforms:
                            zernioPlatforms,

                        // IMPORTANT:
                        // Zernio uses mediaItems (PLURAL)
                        ...(mediaUrl
                            ? {
                                  mediaItems: [
                                      {
                                          type:
                                              post.mediaType ||
                                              "image",
                                          url: mediaUrl,
                                      },
                                  ],
                              }
                            : {}),
                    };

                    // ==========================================
                    // LOG PAYLOAD
                    // ==========================================

                    console.log(
                        "Publishing post:",
                        post._id.toString()
                    );

                    console.log(
                        "Platforms:",
                        JSON.stringify(
                            zernioPlatforms,
                            null,
                            2
                        )
                    );

                    console.log(
                        "Media URL:",
                        mediaUrl
                    );

                    console.log(
                        "Payload:",
                        JSON.stringify(
                            payload,
                            null,
                            2
                        )
                    );

                    console.log(
                        "================================="
                    );

                    // ==========================================
                    // PUBLISH TO ZERNIO
                    // ==========================================

                    const response =
                        await zernio.posts.createPost({
                            body: payload,
                        });

                    console.log(
                        "Zernio response:",
                        JSON.stringify(
                            response,
                            null,
                            2
                        )
                    );

                    const publishedPost =
                        response?.data?.post ||
                        response?.data;

                    if (!publishedPost) {
                        throw new Error(
                            "Zernio did not return a published post"
                        );
                    }

                    // ==========================================
                    // UPDATE POST
                    // ==========================================

                    post.status = "published";

                    await post.save();

                    // ==========================================
                    // ACTIVITY LOG
                    // ==========================================

                    try {
                        await ActivityLog.create({
                            user: post.user,

                            actionType:
                                "POST_PUBLISHED",

                            description:
                                `Published post to ${accounts
                                    .map(
                                        (account) =>
                                            account.platform
                                    )
                                    .join(", ")}`,

                            relatedPost:
                                post._id,
                        });
                    } catch (activityError) {
                        console.error(
                            "Activity log error:",
                            activityError
                        );
                    }

                    console.log(
                        `Post ${post._id} published successfully`
                    );
                } catch (error) {
                    // ==========================================
                    // PUBLISH FAILED
                    // ==========================================

                    console.error(
                        `Failed to publish post ${post._id}:`,
                        error
                    );

                    // Mark failed
                    try {
                        post.status = "failed";
                        await post.save();
                    } catch (saveError) {
                        console.error(
                            "Failed to update post status:",
                            saveError
                        );
                    }

                    // Activity log
                    try {
                        await ActivityLog.create({
                            user: post.user,

                            actionType:
                                "POST_PUBLISH_FAILED",

                            description:
                                `Failed to publish post: ${
                                    error?.message ||
                                    "Unknown error"
                                }`,

                            relatedPost:
                                post._id,
                        });
                    } catch (activityError) {
                        console.error(
                            "Failed activity log:",
                            activityError
                        );
                    }
                }
            }

            console.log(
                `Evaluated ${postsToPublished.length} posts at ${now.toISOString()}`
            );
        } catch (error) {
            console.error(
                "Scheduler error:",
                error
            );
        }
    });
};

export default initSchedular;