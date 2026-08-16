import mongoose, { Schema } from "mongoose"

const accountSchema = new mongoose.Schema({
 user:{type:mongoose.Schema.Types.ObjectId,ref:"User",required:"true"},
 platfrom:{type:String, enum:["twitter","linkedin","facebook","instagram","facebook_page","linkedin_page","instagram_business"],required:true},
 handle:{type:String,required:true},
 zernioAccountId:{type:String},
 accessToken:{type:String},
 refreshToken:{type:String},
 tokenExpireAt:{type:Date},
 status:{type:String,enu:["connected","disconnected"],default:"connected"},
 avatarUrl:{type:String},
 

},{timestamps:true})

export const Account = mongoose.model("Account",accountSchema)
export default Account