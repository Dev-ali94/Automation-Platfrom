import {Account} from "../models/Account.js"
import zernio from "../config/zernio.js"


export const getUserAccount = async (req,res) => {
    try {
       const accounts = await Account.find({user:req.user._id})
       res.status(201).json({success:true,message:"Accounts fetch sucessfully",accounts})
    } catch (error) {
       return res.status(500).json({success:false,message: "Error while fetching accounts data",error: error?.message || error});
    }
}

export const disConnectAccount = async (req,res) => {
    try {
        const account = await Account.findOne({_id:req.params.id,user:req.user._id})
        if (!account) {
            return res.status(404).json({success:false,message:"Account not found"})
        }
        if (account.zernioAccountId) {
            try {
                await zernio.accounts.deleteAccount({path:{accountId:account.zernioAccountId}})
            } catch (error) {
               return res.status(500).json({success:false,message: "Error while disconnecting zernio accounts",error: error?.message || error});
            }
        }
        await account.deleteOne()
        return res.status(201).json({success:true,message:"Account disconnect sucessfully"}) 
    } catch (error) {
       return res.status(500).json({success:false,message: "Error while disConnecting accounts",error: error?.message || error});
    }
}