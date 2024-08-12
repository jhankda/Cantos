import {Router} from 'express';
import { Authenticate, verifyJWT } from '../middlewares/auth.middleware.js';
import { getCategoryTree, getProductCategories, newProductCategory, uploadproduct } from '../controllers/product.contollers.js';
import { upload } from '../middlewares/multer.middleware.js';
import { get } from 'mongoose';


const router = Router();

router.route('/uploadProduct').post(Authenticate,
    upload.single("productImage"), uploadproduct);

router.route('/newCategory').post(Authenticate, newProductCategory);

router.route('/getCategory').get(getProductCategories);

router.route('/categoryTree').get(getCategoryTree)

export default router; 