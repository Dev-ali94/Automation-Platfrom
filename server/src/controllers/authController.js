import { User } from "../models/User.js";
import bcrypt from "bcrypt"
import crypto from "crypto"
import jwt from "jsonwebtoken"
import {sendOtp,sendPasswordResetEmail} from "../services/EmailServices";

// register
export const registration = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validate fields
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, Email & Password are required",
      });
    }

    // Check existing user
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        success: false,
        message: "User already exists with that email",
      });
    }

    // Generate 6 digit OTP
    const newOtp = crypto.randomInt(100000, 1000000).toString();

    // OTP expires after 10 minutes
    const otpExpire = new Date(Date.now() + 10 * 60 * 1000);

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create user
    const user = new User({
      name,
      email,
      password: hashPassword,
      AccountVerified: false,
      otp: newOtp,
      expireOtp: otpExpire,
      otpSendCount: 1,
      lastOtpSent: new Date(),
    });

    await user.save();

    // Send OTP email
    await sendOtp(email, newOtp);

    // Generate JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Set token cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite:
        process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      success: true,
      message: "Registration successfully. Please check your email for OTP verification.",
    });

  } catch (error) {
    return res.status(500).json({success: false,message: "Registration error, please try again later",error:error?.message || error});
  }
};
// verify email
export const verifyEmail = async (req, res) => {
  try {
    const user = req.user;
    const { otp } = req.body;

    // Check user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with that email",
      });
    }

    // Check if already verified
    if (user.AccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Email already verified",
      });
    }

    // Check OTP
    if (!otp) {
      return res.status(400).json({
        success: false,
        message: "OTP is required",
      });
    }

    // Check whether OTP exists
    if (!user.otp) {
      return res.status(400).json({
        success: false,
        message: "No OTP available. Please request a new OTP.",
      });
    }

    // Compare OTP
    if (String(user.otp) !== String(otp)) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (
      !user.expireOtp ||
      user.expireOtp.getTime() < Date.now()
    ) {
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new OTP.",
      });
    }

    user.AccountVerified = true;

    // Remove OTP after successful verification
    user.otp = "";
    user.expireOtp = null;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: "Email verification failed",
      error:error?.message || error
    });
  }
};
// Resend OTP
export const resendOTP = async (req, res) => {
  try {
    const user = req.user;

    // Check user
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not  found with that email",
      });
    }

    // Don't send OTP if already verified
    if (user.AccountVerified) {
      return res.status(400).json({
        success: false,
        message: "Account is already verified. OTP cannot be sent again.",
      });
    }


    const otp = crypto.randomInt(100000, 1000000).toString();

    // OTP expires after 10 minutes
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Update OTP
    user.otp = otp;

    user.expireOtp = otpExpiry;

    // Update OTP information
    user.otpSendCount = (user.otpSendCount || 0) + 1;
    user.lastOtpSent = new Date();

    await user.save();

    // Send OTP email
    await sendOtp(user.email, otp);

    return res.status(200).json({
      success: true,
      message: "New OTP sent to your email!",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to resend OTP",
       error:error?.message || error
    });
  }
};
export const getUserData = async (req, res) => {
  try {
    const userId = req.user.id; 
    const user = await User.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found with that credientials" });
    }

    res.json({
      success: true,
      userData: {
        id:user._id,
        name: user.name,
        email: user.email,
        verified: user.AccountVerified,
      },
    });
  } catch (error) {
    return res.json({success:false,message:"Error while fetching user data", error:error?.message || error});
  }
};
// User login
export const login = async (req, res) => {
  const { email, password } = req.body;
  // check user enter email or password 
  if (!email || !password) {
    return res.json({ success: false, message: "email and passward are required" })
  }
  try {
    // check user eamil is exist or not
    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid eamil" });
    }
    // check user password match or not
    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid pasword" });
    }
    // Generate token for user
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    // Set token in httpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    // set response for user
    return res.json({
      success: true,
      message: "login sucessfuly",
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: "Failed to Login",
       error:error?.message || error
    });
  
  }
}
export const isAuthenticated = async (req, res) => {
  try {
    return res.json({ success: true })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to check authorization",
       error:error?.message || error
    });
  }
}
// User Logout
export const logout = async (req, res) => {
  // try to remove user cookie 
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
    });
    // set response for user
    return res.json({
      success: true,
      message: "logout sucessfuly",
    });
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: "Failed to logout",
       error:error?.message || error
    });
  }
}
// forget password with otp send 
export const forgetPassword = async (req, res) => {

  const { email } = req.body;
  if (!email) {
    return res.json({ success: false, message: "Enter your email" })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "user not found" })
    }
    const newOtp = crypto.randomInt(100000, 999999).toString();

    user.forgetPasswordOtp = newOtp;
    user.expireForgetPasswordOtp = Date.now() + 15 * 60 * 1000;
    await user.save()
    await sendPasswordResetEmail(email, newOtp);
    return res.json({ success: true, message: "Please check your email for OTP verification" })
  } catch (error) {
   return res.status(500).json({
      success: false,
      message: "Failed to forgetPassword",
       error:error?.message || error
    });
  
  }
}
// reset password and verify otp
export const resetpassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.json({ success: false, message: "Enter your all field" })
  }
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.json({ success: false, message: "user not found" })
    }
    if (user.forgetPasswordOtp === "" || user.forgetPasswordOtp !== otp) {
      return res.json({ success: false, message: "invalid otp" })
    } if (user.expireForgetPasswordOtp < Date.now()) {
      return res.json({ success: false, message: "Expired otp" })
    }
    const hashpassword = await bcrypt.hash(newPassword, 10)
    user.password = hashpassword
    user.forgetPasswordOtp = ""
    user.expireForgetPasswordOtp = 0
    await user.save()
    return res.json({ success: true, message: "Password successfully change" })
  } catch (error) {
    console.error("logout error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to resetPassword",
       error:error?.message || error
    });
  }
}