import  express from 'express'
import {upload} from "../config/multer.js"
import protect from '../middlewares/AuthMiddleware.js'
import { createGeneration, createPostFromGeneration, getGenerationData } from '../controllers/generationController.js';

const router = express.Router();

router.post("/generate",protect ,createGeneration)
router.post("/schedule",protect,upload.single("media") ,createPostFromGeneration)
router.get("/",protect ,getGenerationData)

export default  router