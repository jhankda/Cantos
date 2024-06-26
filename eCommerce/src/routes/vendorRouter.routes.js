import {Router} from "express";
import { Authenticate } from "../middlewares/auth.middleware.js";

import {changeCurrentPassword, createVendor, loginHistory, loginVendor, logoutVendor, registerVendor, updateDetails}  from '../controllers/Vendor.controllers.js'

const router  = Router()

router.route('/createVendor').post(createVendor)
router.route('/registerVendor/:token').get(registerVendor)
router.route('/loginVendor').post(loginVendor)
router.route('/logoutVendor').delete(logoutVendor)
router.route('/updateVendor').patch(Authenticate,updateDetails)
router.route('/changepass').patch(Authenticate,changeCurrentPassword)
router.route('/loginHistory').get(Authenticate,loginHistory)


export default router;