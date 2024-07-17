import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/AsyncHandler.js'
import { ApiError } from '../utils/ApiError.js'
import  { User} from '../models/consumer/user.models.js'
import { addOperationinQ } from '../producer.js'

export const verifyJWT  = asyncHandler(async(req,_,next) => {
    try {
        const token  = req.cookies?.accessToken  ||req.header("Authorization")?.replace("Bearer ","")
        if (!token){
            throw new ApiError(401,"Unauthorized")}
        console.log(token)
        const user = await addOperationinQ("USER0","VERIFY-ACCESS-TOKEN","User",{token:token})
        req.user = user
 
        next()
    } catch (error) {
        throw new ApiError(401,error?.messagae || "Unauthorized")
    }

})

import {Vendor} from '../models/consumer/vendor.models.js'

export const Authenticate  = asyncHandler(async(req,_,next) => {
    try {
        const token  = req.cookies?.accessToken  ||req.header("Authorization")?.replace("Bearer ","")
        if (!token){
            throw new ApiError(401,"Unauthorized")
        }

        const decoded = jwt.verify(token, process.env.VENDOR_ACCESS_TOKEN_SECRET)

        const vendor = await Vendor.findById(decoded?._id).select("-password")
        req.vendor = vendor
        
        next()
    } catch (error) {
        throw new ApiError(401,error?.messagae || "Unauthorized")
    }

})