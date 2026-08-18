import  express from 'express'
import protect from '../middlewares/AuthMiddleware.js'
import {upload} from "../config/multer.js"
import { getPostData, schedulePost } from '../controllers/postController.js';


const router = express.Router();

router.post("/schedule",protect,upload.single("media") ,schedulePost)
router.get("/",protect,getPostData)

export default  router