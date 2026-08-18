import  express from 'express'
import { disConnectAccount, getUserAccount } from '../controllers/accountController.js'
import protect from '../middlewares/AuthMiddleware.js'
const router = express.Router()

router.get("/",protect, getUserAccount)
router.post("/:id", protect, disConnectAccount)


export default  router