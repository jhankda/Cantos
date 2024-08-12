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
import { Product } from '../models/Product/product.models.js'
import { uploadOnCloudinary} from '../utils/cloudinary.js'
import { ProductCategory } from '../models/Product/category.models.js';
import { addOperationinQ } from '../producer.js';
import { ObjectId } from 'mongodb';



const uploadproduct = asyncHandler(async(req,res) => {
    const {name, sku, description, price , categoryId} = req.body
    const productImageLocalPath = req.file?.path

    if([name,sku, description,price].some((field) => field?.trim() === '')){
        throw new ApiError(400, 'All fields are required')
    }
    if(!(productImageLocalPath)){
        throw new ApiError(400, 'Product image is required')
    }
    const uploadImage = await uploadOnCloudinary(productImageLocalPath)
    if(!(uploadImage)){
        throw new ApiError(500, 'Failed to upload image')
    }


    const newProduct = await addOperationinQ("PRODUCT0","CREATE","Product",{
        name,
        sku,
        description,
        price,
        productImage: uploadImage,
        vendorId: req.vendor.id,
        categoryId: new mongoose.Types.ObjectId(categoryId)
    })

    if(!(newProduct)){
        throw new ApiError(500, 'Failed to upload product')
    
    }


    res
    .status(200)
    .json(new ApiResponse(200, 'Product uploaded successfully', {name, sku, description, price}))
})

const newProductCategory = asyncHandler(async(req,res) => { 
    const {name , code, parentCode, description} = req.body

    if([name, code , parentCode, description].some((field) => field?.trim() === '')){
        throw new ApiError(400, 'All fields are required')
    }

    const newProductCategory = await addOperationinQ("PRODUCT", "CREATE", "ProductCategory", {
        name,
        code,
        parentCode,
        description
    })

    if(!(newProductCategory)){
        throw new ApiError(500, 'Failed too create product category')
    }

    res
    .status(200)
    .json(new ApiResponse(200, 'Product category created successfully', {name, code, parentCode, description}))
})

const updateProduct  = asyncHandler(async(req,res) => {
   

})

const getProductCategories = asyncHandler(async (req, res) => {
    const productCategories = await addOperationinQ("VENDOR0", "FINDMANY", "ProductCategory", {})

    res
    .status(200)
    .json(new ApiResponse(200, 'Product categories fetched successfully', productCategories))
})



const getCategoryTree = asyncHandler(async (req, res) => {
    const categories = await addOperationinQ("USER0","FINDMANY","ProductCategory",{})
    const categoryMap = {}

    categories.forEach(category => {

        categoryMap[category.code] = { ...category, subcategory:[]}
    })

    const categoryTree = []
    categories.forEach(category => {
        if(category.parentCode){
            categoryMap[category.parentCode].subcategory.push(categoryMap[category.code]._id,categoryMap[category.code].name,categoryMap[category.code].subcategory)

        }
        else{
            categoryTree.push(categoryMap[category.code]._id, categoryMap[category.code].name,categoryMap[category.code].subcategory)
        }
    })

    res
    .status(200)
    .json(new ApiResponse(200,'Category tree fetched successfully',categoryTree))
})

// would get back on it soon...
const getProductSuggestions  = asyncHandler(async(req,res)=> {
    const {search} = req.query
})




export { uploadproduct, newProductCategory, getProductCategories,getCategoryTree, updateProduct, getProductSuggestions } 