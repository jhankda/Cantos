import { Router } from "express";

import {createUser, loginUser, registerUser, updateUser} from '../controllers/User.controllers.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router()


router.route('/regverifyEmail').post(createUser)
router.route('/registerUser/:token').get(registerUser)
router.route('/login').post(loginUser)
router.route('/updateUser').post(verifyJWT,updateUser)

export default router; 