import  express from 'express'
import userAuth from '../middlewares/AuthMiddleware.js'
import { addAccount, disConnectAccount, getUserAccount } from '../controllers/accountController.js'
const router = express.Router()

router.get("/",userAuth, getUserAccount)
router.post("/",userAuth,addAccount)
router.post("/:id", userAuth, disConnectAccount)


export default  router