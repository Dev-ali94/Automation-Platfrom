import  express from 'express'
import userAuth from '../middlewares/AuthMiddleware.js'
import { registration, verifyEmail,resendOTP,isAuthenticated,forgetPassword,resetpassword,login,logout } from '../controllers/authController.js';
const router = express.Router();

router.post("/register", registration)
router.post("/verify",userAuth,verifyEmail)
router.post("/resend-otp", userAuth, resendOTP)
router.get("/auth",userAuth ,isAuthenticated)
router.post("/forget-password", forgetPassword)
router.post("/reset-password", resetpassword)
router.post("/login", login)
router.post("/logout",logout)


export default  router