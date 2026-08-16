import  express from 'express'

import { generateAuthUrl,syncedAccount } from '../controllers/socialAuthController.js';
import userAuth from '../middlewares/AuthMiddleware.js';
const router = express.Router();

router.post("/:platform/url",userAuth,generateAuthUrl)
router.post("/sync", userAuth,syncedAccount)



export default  router