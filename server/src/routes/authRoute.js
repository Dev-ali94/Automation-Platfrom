import  express from 'express'
import protect from '../middlewares/AuthMiddleware.js'
import { registration, verifyEmail,resendOTP,isAuthenticated,forgetPassword,resetpassword,login,logout, getUserData } from '../controllers/authController.js';
const router = express.Router();

router.post("/register", registration)
router.post("/verify",protect,verifyEmail)
router.post("/resend-otp", protect, resendOTP)
router.get("/auth",protect ,isAuthenticated)
router.get("/data",protect, getUserData )
router.post("/forget-password", forgetPassword)
router.post("/reset-password", resetpassword)
router.post("/login", login)
router.post("/logout",logout)


export default  router