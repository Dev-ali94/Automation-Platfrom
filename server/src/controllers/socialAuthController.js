import zernio from "../config/zernio.js"
import {User} from "../models/User.js"
import {Account} from "../models/Account.js"

export const getOrCreateZernioProfile = async (user) => {
    try {
        const result = await zernio.profiles.listProfiles();

        const data = result.data;

        const profiles = Array.isArray(data)
            ? data
            : data?.profiles || data?.profile || data?.data || [];

        // Existing profile
        if (profiles.length > 0) {
            const pid = profiles[0]._id || profiles[0].id;

            if (!pid) {
                throw new Error("Zernio profile ID not found");
            }

            await User.findByIdAndUpdate(
                user._id,
                { zernioProfileId: pid }
            );

            return pid;
        }

        // Create new profile
        const createResult = await zernio.profiles.createProfile({
            body: {
                name: `${user.name || user.email}'s workspace`
            }
        });

        const created = createResult.data?.profile || createResult.data;

        const pid = created?._id || created?.id;

        if (!pid) {
            throw new Error(
                "No ID found, Zernio profile creation failed"
            );
        }

        await User.findByIdAndUpdate(
            user._id,
            { zernioProfileId: pid }
        );

        return pid;

    } catch (error) {
        console.error("Error while creating Zernio profile:", error);
        throw error;
    }
};

export const generateAuthUrl = async (req, res) => {
    try {
        const { platform } = req.params;
        if (!req.user) {
            return res.status(401).json({success: false,message: "User not Authenticated"});
        }
        const profileId = await getOrCreateZernioProfile(req.user);
        if (!profileId) {
            return res.status(500).json({success: false,message: "Zernio profile ID was not created"});
        }
        const redirectUrl = `${process.env.FRONTEND_URL}/account`;
        const result = await zernio.connect.getConnectUrl({
            path: {platform: platform},
            query: {
                profileId: profileId,
                redirect_url: redirectUrl
            }
        });
        const data = result.data;
        const authUrl = data?.authUrl;

        if (!authUrl) {
            return res.status(500).json({success: false,message: "Zernio did not return authentication URL",data: data});
        }
        return res.status(200).json({success: true,url:authUrl,message:"Authentication url Created",});

    } catch (error) {
        return res.status(500).json({success:false,message:"Error while creating profile",error:error?.message || error})
    }
};

export const syncedAccount = async (req, res) => {
    try {
        const profileId = await getOrCreateZernioProfile(req.user);
        if (!profileId) {
            return res.status(500).json({success: false,message: "Zernio profile ID not found"});
        }
        const result = await zernio.accounts.listAccounts({
            query: {profileId}
        });
        const data = result.data;
        const zernioAccounts =data?.accounts ||(Array.isArray(data) ? data : []);
        const supportedPlatforms = ["twitter","instagram","facebook","linkedin"];
        const syncedAccounts = [];

        for (const zAccount of zernioAccounts) {
            const zid = zAccount._id || zAccount.id;
            if (!zid) {
                console.warn("Skipping account with no ID:",zAccount);
                continue;
            }
            const platformValue = zAccount.platform || zAccount.type || "";
            const rawPlatform = String(platformValue).toLowerCase();
            const normalizedPlatform = supportedPlatforms.find((platform) => rawPlatform.includes(platform));
            if (!normalizedPlatform) {
                console.log(`Skipping unsupported platform: "${rawPlatform}"`);
                continue;
            }

            const account = await Account.findOneAndUpdate(
                {
                    zernioAccountId: zid
                },
                {
                    user: req.user._id,
                    platform: normalizedPlatform,
                    handle:zAccount.username || zAccount.name || zAccount.handle || "unknown",
                    zernioAccountId: zid,
                    status: "connected",
                    avatarUrl: zAccount.avatarUrl || zAccount.picture || zAccount.profile_image_url || "unknown"
                },
                {
                    upsert: true,
                    new: true
                }
            );

            syncedAccounts.push(account);
        }

        return res.status(200).json({success: true,message: "Accounts Connected successfully", accounts: syncedAccounts})

    } catch (error) {
        return res.status(500).json({success:false,message:"Error while synced account",error:error?.message || error})
    }
};