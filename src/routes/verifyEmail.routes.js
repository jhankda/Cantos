import { Router } from "express";

import {createUser, loginUser, logoutUser, refreshAccessToken, registerUser, updatePassword, updateUser} from '../controllers/User.controllers.js'
import {verifyJWT} from '../middlewares/auth.middleware.js'

const router = Router()


router.route('/regverifyEmail').post(createUser)
router.route('/registerUser/:token').get(registerUser)
router.route('/login').post(loginUser)
router.route('/updateUser').patch(verifyJWT,updateUser)
router.route('/updatePass').patch(verifyJWT,updatePassword)
router.route('/logout').delete(verifyJWT,logoutUser)
router.route('/refreshToken').get(refreshAccessToken)


export default router;  