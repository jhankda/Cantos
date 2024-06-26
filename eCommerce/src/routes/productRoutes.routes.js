import {Router} from 'express';
import { Authenticate, verifyJWT } from '../middlewares/auth.middleware.js';
import { newProductCategory, uploadproduct } from '../controllers/product.contollers.js';
import { upload } from '../middlewares/multer.middleware.js';


const router = Router();

router.route('/uploadProduct').post(Authenticate,
    upload.single("productImage"), uploadproduct);

router.route('/newCategory').post(Authenticate, newProductCategory);

export default router; 