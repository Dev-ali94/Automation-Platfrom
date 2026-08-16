import { timeStamp } from 'console'
import mongoose from 'mongoose'

const userScheme = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    AccountVerified: { type: Boolean, default: false },
    otp: { type: String, default: "" },
    expireOtp: { type: Date, default: 0 },
    otpSendCount: { type: Number, default: 0 },
    lastOtpSent: { type: Date, default: null },
    forgetPasswordOtp: { type: String, default: "" },
    expireForgetPasswordOtp: { type: Date, default: 0 },
    zernioProfileId:{type:String}
},{timeStamp:true})
export const User = mongoose.model("User", userScheme)
export default User