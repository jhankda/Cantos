import { Router } from "express";
import { searchsuggestion } from "../services/searchService.js";

const router  = Router();

router.get('/',(req,res)=>{
    res.send('Search Service is running')
})

router.route('/:queryField').get(searchsuggestion)
export default router;