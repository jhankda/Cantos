import { asyncHandler } from '../utils/AsyncHandler.js'
import { User } from '../models/consumer/user.models.js'
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
import { addOperationinQ} from '../producer.js';
// import { transporter } from '../app.js';
// import { SMTPClient } from 'emailjs';





const GenrateAccessAndRefreshTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Failed to generate tokens")
    }
}


const createUser = asyncHandler(async (req, res) => {

    const { firstName, middleName, lastName, email, password } = req.body
    console.log(email)

    if (
        [firstName, email, lastName, password].some((field) =>
            field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")

    } else {
        console.log("All fields are filled")
    }

    

    const existedUser  = await addOperationinQ("USER0","FINDONE","User",{email})

    if (existedUser) {
        throw new ApiError(409, "User already exists")
    }

    const token = await cryptoRandomString({ length: 6, type: 'distinguishable' });
    const hashToken = await bcrypt.hash(token, 10)


    sendMail(email, "Welcome to Our Ecommerce project", ` Hi ${firstName} ${lastName}, Your token is ${token} `, TokenSheet(firstName, token))




    const options = {
        httpOnly: true,
        secure: true


    }

    res
        .status(201)
        .cookie("firstName", firstName, options)
        .cookie("middleName", middleName, options)
        .cookie("email", email, options)
        .cookie("password", password, options)
        .cookie("lastName", lastName, options)
        .cookie("hashToken", hashToken, options)
        .json(new ApiResponse(201, "User created"))

})

const registerUser = asyncHandler(async (req, res) => {
    const { token } = req.params
    const hashToken = req.cookies?.hashToken || req.header("Authorization")?.replace("Bearer ", "")



    if (!hashToken) {
        throw new ApiError(401, "Unauthorized try again pasting token")
    }

    const decodedToken = await bcrypt.compare(token, hashToken)

    if (!decodedToken) {
        throw new ApiError(404, "User not found")



    }


    const userdata = {
        firstName: req.cookies.firstName,
        middleName: req.cookies.middleName,
        lastName: req.cookies.lastName,
        email: req.cookies.email,
        password: req.cookies.password,

    }

    const createUser  = await addOperationinQ("USER0","CREATE","User",userdata).then((data)=>{return data})


    console.log("createUser",createUser)

    

  
    

    const options = {
        httpOnly: true,
        secure: true
    }





    res
        .status(201)
        .clearCookie("middleName", options)
        .clearCookie("firstName", options)
        .clearCookie("email", options)
        .clearCookie("password", options)
        .clearCookie("lastName", options)
        .clearCookie("hashToken", options)


        .json(new ApiResponse(201, "User created", createUser))

})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    const { os, platform, source, version, browser } = req.useragent


    if (!email && !password) {
        throw new ApiError(400, "All fields are required")
    }


    const existedUser = await addOperationinQ("USER0","FINDONE","User",{email})

    if (!existedUser) {
        throw new ApiError(404, "User not found")
    }


    const loginAttempts = await LoginAttempts.create({
        customerId: new mongoose.Types.ObjectId(existedUser._id),
        os,
        browser,
        loginTime: Date.now()
    })


    const isMatch = await existedUser.compareThisPassword(password)
    if (!isMatch) {
        await loginAttempts.updateOne({ loginTry: false })
        throw new ApiError(401, "Invalid credentials")
    }

    const { accessToken, refreshToken } = await GenrateAccessAndRefreshTokens(existedUser._id)

    


    const loggedInUser = await User.findById(existedUser._Id).select("-password ")

    sendMail(email, "Cantos: New User Login", `Hi ${existedUser.firstName} ${existedUser.lastName}, You have logged in from ${source}`, newLoginSheet(existedUser.firstName, os, platform, browser))


    const options = {
        httpOnly: true,
        secure: true
    }



    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .cookie("loggedInUser", loggedInUser, options)
        .json(new ApiResponse(200, "User logged in", loggedInUser))



})

const updateUser = asyncHandler(async (req, res) => {
    const { firstName, middleName, lastName } = req.body

    const updatedUser = await User.findByIdAndUpdate(req.user._id, {
        firstName,
        middleName,
        lastName
    }, { new: true }
    )


    res
        .status(200)
        .json(new ApiResponse(200, "User updated", updatedUser))
})

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body
    console.log(oldPassword)

    if (!oldPassword && !newPassword) {
        throw new ApiError(400, "All fields are required")
    }

    const user = await User.findById(req.user._id)

    const isMatch = await user.compareThisPassword(oldPassword)
    if (!isMatch) {
        throw new ApiError(401, "Invalid credentials")
    }

    const updatedPassword = await User.findByIdAndUpdate(user._id, {
        password: await bcrypt.hash(newPassword,10)
    }, { new: true }).select("password")


    

    res
        .status(200)
        .json(new ApiResponse(200, "Password updated", updatedPassword))
})

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1
        }
    }, { new: true })

    const options = {
        httpOnly: true,
        secure: true
    }

    res
        .status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new ApiResponse(200, "User logged out"))
})

const refreshAccessToken = asyncHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken

    if (!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized")
    }

    const decodedToken = await jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)

    const user = await User.findById(decodedToken?._id)
    console.log(user.firstName)

    if (!user) {
        throw new ApiError(404, "User not found")
    }
    
    if (user.refreshToken !== incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized")
    }

    const { accessToken, refreshToken } = await GenrateAccessAndRefreshTokens(user._id)

    // await User.findByIdAndUpdate(user._id, { refreshToken }, { new: true })

    const options = {
        httpOnly: true,
        secure: true
    }



    res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, "Token refreshed"))

})

const loginHistory = asyncHandler(async (req,res) => {
    const user = req.user

    const loginHistory  = await LoginAttempts.aggregate(
        [
            {
              $match: {
                'customerId':new mongoose.Types.ObjectId(user._id)
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
    createUser,
    registerUser,
    loginUser,
    updateUser,
    updatePassword,
    logoutUser,
    refreshAccessToken,
    loginHistory
}