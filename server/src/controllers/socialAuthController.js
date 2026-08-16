import zernio from "../config/zernio.js"
import {User} from "../models/User.js"
import {Account} from "../models/Account.js"
export const getOrCreateZernioProfile = async (req,res) => {
    try {
        const result = await zernio.profiles.listProfiles()
        const data = result.data
        const profile = Array.isArray(data) ? data: data?.profile || data?.data || []
        if (profile.length > 0) {
            const pid = profile[0]._id || profile[0].id
            await User.findByIdAndUpdate(user._id,{zernioProfileId:pid})
            return pid
        }
        const createResult = await zernio.profiles.createProfile({
            body:{name:`${user.name || user.email}'s workspace`}
        })
        const created = (createResult.data)?.profile || createResult.data
        const pid = created?._id || created?.id
        if (!pid) {
            throw new Error("No ID FOUND SO PROFILE CREATION FAILED");
        }
        await User.findByIdAndUpdate(user._id,{zernioProfileId:pid})
        return pid
    } catch (error) {
        console.log("Error Found While creating Profile",error?.message || error);
        
    }
}




export const generateAuthUrl = async (req,res) => {
    try {
        const {platform} = req.params
        const profileId = await getOrCreateZernioProfile(req.user)
        const orgion =  req.headers.orgion
        const redirectUrl = `${orgion}/accounts` 
        const result = await zernio.connect.getConnectUrl({
            path:{platform:platform},
            query:{profileId,redirect_url:redirectUrl}
        })
        const data = result.data
        console.log("getConnectUrl Response",JSON.stringify(data,null,2));
        const authUrl = data.authUrl
        if (!authUrl) {
            throw new Error(`Error in redrict ${JSON.stringify(data,null,2)}`)
        }
        req.json({url:authUrl})
    } catch (error) {
        console.log("error while auth in zernio",error?.message || error);
        
    }
}

export const syncedAccount = async (req,res) => {

    try {
          const profileId = await getOrCreateZernioProfile(req.user)
    const result = await zernio.accounts.listAccounts({
        query:{profileId}
    })
    const data = result.data
    const zernioAccount = data?.accounts || (Array.isArray(data) ? data : [])
    const supportedPlatfrom = ["twitter","instagram","facebook","linkedin"]
    const syncedAccount =[]
    for(const zAccount of zernioAccount){
        const zid = zAccount._id || zAccount.id
       if (!zid) {
           console.warn("Skipping account with no id",zAccount)
           continue
       }
    const rawPlatform = (zAccount.platform || zAccount.type || "").toLoweCase()
    const normalizationPlatfrom = supportedPlatfrom.find((p)=>rawPlatform.includes(p))
     if (!normalizationPlatfrom) {
           console.log(`Skipping unSupported platform:"${rawPlatform}"`)
           continue
       }
       const account = await Account.findOneAndUpdate(
        {zernioAccountId:zid},
        {
            user:req.user._id,
            platfrom:normalizationPlatfrom,
            handle:zAccount.username|| zAccount.name || zAccount.handle || "unknown",
            zernioAccountId:zid,
            status:"connected",
            avatarUrl:zAccount.avatarUrl|| zAccount.picture || zAccount.profile_image_url || "unknown",
        },
        {upsert:true,returnDocument:"after"}
       )
       syncAccount.push(account)
    }
res.json(syncAccount)
    } catch (error) {
         console.log("error while sync acount",error?.message || error);
    }
   
}