import  express from 'express'
import userAuth from '../middlewares/AuthMiddleware.js'
import {upload} from "../config/multer.js"
import { getPostData, schedulePost } from '../controllers/postController.js';


const router = express.Router();

router.post("/",userAuth,upload.single("media") ,schedulePost)
router.get("/",userAuth,getPostData)

export default  router