import clientController from "../../controller/clientController"
import authMiddleware from "../../middleware/authMiddleware"
import { upload } from "../../middleware/multer"

const router = require('express').Router()

// Register
router.post('/register', clientController.RegisterClient)


export default router