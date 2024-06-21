import { asyncHandler } from '../utils/AsyncHandler.js'
// import { User } from '../models/consumer/user.models.js'
import {Vendor} from '../models/consumer/vendor.models.js'
import { LoginAttempts } from '../models/consumer/loginAttempts.models.js';
import { ApiError } from '../utils/ApiError.js'
import mongoose, { Mongoose } from "mongoose";
import { ApiResponse } from '../utils/ApiResponse.js'
import { json } from "express";
import bcrypt from 'bcrypt'
import cryptoRandomString from 'crypto-random-string';
import { sendMail } from '../utils/sendMail.js';
import { TokenSheet, newLoginSheet } from '../emailTemplate/OTPverifiaction.js';
import jwt from 'jsonwebtoken'

const generateTheAccessToken = async (vendorId) => {
    try {
        const vendor  = await Vendor.findById(vendorId)
        const accessToken  =  vendor.generateAccessToken()
        return accessToken
    } catch (error) {
        throw new ApiError(500,"Failed to generate token")
        
    }
}

const createVendor = asyncHandler(async(req,res) => {
    const {companyCode, name, description, postalAddress, country, city, password, email} = req.body

    if([companyCode,name,description,postalAddress,country,city,password,email].some((field) => field?.trim() === "")){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({email})
    if(!(existedUser)){
        throw new ApiError(409,"User already exists")
    }

    const token = cryptoRandomString({length:4,type:"distinguishable"})
    const hashToken  = await bcrypt.hash(token,10)

    sendMail(email, "Welcome to Our Ecommerce project", ` Hi ${name} , Your token is ${token} `, TokenSheet(name, token))


    const options  = {
        httpOnly:true,
        secure:true
    }


    res
    .status(201)
    .cookie("token",hashToken,options).cookie("companyCode",companyCode,options)
    .cookie("name",name,options).cookie("description",description,options)
    .cookie("postalAddress",postalAddress,options).cookie("country",country,options).
    cookie("city",city,options).cookie("password",password,options)
    .cookie("email",email,options)
    .json(new ApiResponse(201,"Vendor created successfully"))
})

const registerVendor =asyncHandler(async(req,res) => {
    
    const {token} = req.params
    const hashToken = req.cookies?.token || req.header("Authorization")?.replace("Bearer ", "")
    console.log(token,hashToken)

    if(!hashToken || !token){
        throw new ApiError(400,"Invalid token")
    }

    const decodedToken = await bcrypt.compare(token,hashToken)

    if(!decodedToken){
        throw new ApiError(401,"Unauthorized")
    }

    const createdVendor  = await Vendor.create({
        companyCode:req.cookies.companyCode,
        name:req.cookies.name,
        description:req.cookies.description,
        postalAddress:req.cookies.postalAddress,
        country:req.cookies.country,
        city:req.cookies.city,
        password:req.cookies.password,
        email:req.cookies.email
    })

    const vendor  = await Vendor.findById(createdVendor._id).select("-password")
    if(!vendor){
        throw new ApiError(404,"Vendor not found")
    }
    

    const options  = {
        httpOnly:true,
        secure:true}

    res
    .status(201)
    .clearCookie("token",options).clearCookie("companyCode",options).clearCookie("name",options)
    .clearCookie("description",options).clearCookie("postalAddress",options).clearCookie("country",options).clearCookie("city",options).clearCookie("password",options).clearCookie("email",options)
    .json(new ApiResponse(201,"Vendor created successfully"))

})

const loginVendor  =  asyncHandler(async(req,res) => {
    const {email, password} = req.body
    const { os, platform, source, version, browser } = req.useragent


    if(!email || !password){
        throw new ApiError(400,"Email and password are required")
    
    }

    const existedVendor = await Vendor.findOne({email})
    if(!existedVendor){
        throw new ApiError(404,"User not found")
    }

    const loginAttempts = await LoginAttempts.create({
        customerId: new mongoose.Types.ObjectId(existedVendor._id),
        os,
        browser,
        loginTime: Date.now()
    })

    const isMatch  = await existedVendor.verifyPassword(password)
    if(!isMatch){
        throw new ApiError(401,"Invalid credentials")
    }
    const accessToken  = await generateTheAccessToken(existedVendor._id)

    const loggedInVendor  = await Vendor.findById(existedVendor._id).select("-password")

    sendMail(email, "Cantos: New Login", `Greetings ${existedVendor.name} , You have logged in from ${source}`, newLoginSheet(existedVendor.name, os, platform, browser))


    const options  = {
        httpOnly:true,
        secure:true
    }

    res
    .status(200)
    .cookie("accessToken",accessToken,options)
    .json(new ApiResponse(200,"User logged in successfully",loggedInVendor))
})


const logoutVendor  =  asyncHandler(async(req,res) =>{
    const options  = {
        httpOnly:true,
        secure:true
    }

    res
    .status(200)
    .clearCookie("accessToken",options)
    .json(new ApiResponse(200,"User logged out successfully"))
})

const updateDetails = asyncHandler(async(req,res) => {
    const {name, description, postalAddress, country, city} = req.body

    const vendor = await Vendor.findByIdAndUpdate(req.vendor._id,
        {
            name,
            description,
            postalAddress,
            country,
            city

        },{new:true})

    
        res
        .status(200)
        .json(new ApiResponse(200,"Vendor details updated",vendor))
}) 


const changeCurrentPassword =  asyncHandler(async(req,res) => {
    const {oldPassword, newPassword} = req.body

    if(!oldPassword || !newPassword){
        throw new ApiError(400,"Old password and new password are required")
    }

    const vendor = await Vendor.findById(req.vendor._id)

    const isMatch = await vendor.verifyPassword(oldPassword)
    if(!isMatch){
        throw new ApiError(401,"Invalid credentials")
    }

    const upatedPassword = await Vendor.findByIdAndUpdate(vendor._id,{
        password:await bcrypt.hash(newPassword, 12)
    },{new:true}).select("-passsword")




    res
    .status(200)
    .json(new ApiResponse(200,"Password updated"))
})


const loginHistory  =  asyncHandler(async(req,res) => {
    
    const vendor  = req.vendor
    const loginHistory = await LoginAttempts.aggregate(
        [
            {
              $match: {
                'customerId':new mongoose.Types.ObjectId(vendor._id)
              }
            }, {
              $sort: {
                'loginTime': -1
              }
            }, {
              $project: {
                'loginTime': 1, 
                'browser': 1, 
                'os': 1, 
                'loginTry': 1
              }
            }
          ]
    )

    res
    .status(200)
    .json(new ApiResponse(200,"Login history",loginHistory))
})

export {
    createVendor,
    registerVendor,
    loginVendor,
    logoutVendor,
    updateDetails,
    changeCurrentPassword,
    loginHistory}