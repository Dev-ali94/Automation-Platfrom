import  express from 'express'
import {upload} from "../config/multer.js"
import userAuth from '../middlewares/AuthMiddleware.js'
import { createGeneration, createPostFromGeneration, getGenerationData } from '../controllers/generationController.js';

const router = express.Router();

router.post("/generate",userAuth ,createGeneration)
router.post("/post",userAuth,upload.single("media") ,createPostFromGeneration)
router.get("/",userAuth ,getGenerationData)

export default  router