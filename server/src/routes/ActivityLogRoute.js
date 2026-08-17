import  express from 'express'
import userAuth from '../middlewares/AuthMiddleware.js'
import { getActivity } from '../controllers/activityController.js';


const router = express.Router();

router.get("/",userAuth ,getActivity)


export default  router