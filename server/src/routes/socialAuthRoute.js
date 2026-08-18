import  express from 'express'
import { generateAuthUrl,syncedAccount } from '../controllers/socialAuthController.js';
import protect from '../middlewares/AuthMiddleware.js'
const router = express.Router();

router.post("/:platform/url",protect,generateAuthUrl)
router.post("/sync", protect,syncedAccount)



export default  router