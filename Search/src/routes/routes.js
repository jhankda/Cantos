import { Router } from "express";
import { getProduct, searchsuggestion } from "../services/searchService.js";

const router  = Router();

router.get('/',(req,res)=>{
    res.send('Search Service is running')
})

router.route('/:queryField').get(searchsuggestion)
router.route('/id/:queryfield').get(getProduct)
export default router;