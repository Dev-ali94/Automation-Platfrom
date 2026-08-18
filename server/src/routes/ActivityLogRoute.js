import  express from 'express'
import protect from '../middlewares/AuthMiddleware.js'
import { getActivity } from '../controllers/activityController.js';
const router = express.Router();

router.get("/",protect ,getActivity)


export default  router