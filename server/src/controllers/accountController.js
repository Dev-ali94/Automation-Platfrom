import {Account} from "../models/Account.js"
import zernio from "../config/zernio.js"


export const getUserAccount = async (req,res) => {
    try {
       const accounts = await Account.find({user:req.user._id})
       res.status(201).json({success:true,message:"Accounts fetch sucessfully",accounts})
    } catch (error) {
        console.log("Error while fetching accounts data",error?.message || error);
    }
}


export const addAccount = async (req,res) => {
    try {
        const {platform,handle,avatarUrl} =req.body
       const account = await Account.create({user:req.user._id,platform,handle,avatarUrl})
       res.json(account)
    } catch (error) {
        console.log("Error white Adding Account",error?.message || error);
        
    }
}


export const disConnectAccount = async (req,res) => {
    try {
        const account = await Account.findOne({_id:req.params.id,user:req.user._id})
        if (!account) {
            return res.status(404).json({message:"Account not found"})
        }
        if (account.zernioAccountId) {
            try {
                await zernio.accounts.deleteAccount({path:{accountId:account.zernioAccountId}})
            } catch (error) {
               return res.status(404).json({success:false,message:"Error while disconnect account"},error?.response?.data?.message || error?.message) 
            }
        }
        await account.deleteOne()
        return res.status(201).json({success:true,message:"Account disconnect sucessfully"}) 
    } catch (error) {
        console.log("Error white dsconnect Account",error?.message || error)
        throw error
    }
}