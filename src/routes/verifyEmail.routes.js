import { Router } from "express";

import {createUser, loginUser, registerUser} from '../controllers/User.controllers.js'

const router = Router()


router.route('/regverifyEmail').post(createUser)
router.route('/registerUser/:token').get(registerUser)
router.route('/login').post(loginUser)

export default router;