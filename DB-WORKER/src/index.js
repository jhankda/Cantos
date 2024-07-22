// crud operation starts
import { asyncHandler } from "../utils/asyncHandler.js"
import { modelsMap } from "../modelsMap.js"
import { DBerror } from "../utils/DBerror.js"
import { User } from "../models/consumer/user.models.js"
import jwt from "jsonwebtoken"
import mongoose from "mongoose"

const ifexists = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const checkModel = await Model.findOne(data.body);
        if (checkModel) {
            return checkModel;
        }
        else {
            return new DBerror(500, "User Not Found ")
        }
    } catch (error) {
        return new DBerror(500, "Error in finding process:",error)
    }
})

const find = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        let checkModel
        if (data.userId == false || data.userId == "USER0" || data.userId == "VENDOR0"){
        checkModel = await Model.findOne(data.body);
        }else{
            checkModel = await Model.findById(data.userId);
        }
        return checkModel;
    } catch (error) {   
        return new DBerror(500, "Error in finding process:",error)
    }
})

        
            


const ifexistsById = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const checkModel = await Model.findById(data.body.uniqueId);
        if (checkModel) {
            return checkModel;
        }
        else {
            return new DBerror(500, "User Not Found ");
        }
    } catch (error) {
        throw new DBerror(500, "Error in finding by id", error)
    }
})

const creation = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const createdModel = await Model.create(data.body);
        const ifexistModel = await Model.findById(createdModel._id);
        if (!ifexistModel) {
            return new DBerror(500, "Error in creation")
        } else {
            return createdModel;
        }
    } catch (error) {
        return new DBerror(500, "Error in creation", error);
    }
}
)


const comparePass = asyncHandler(async (data) => {

    try {
        let Model = modelsMap[data.Model];
        let existedUser;
        if (data.userId == false || data.userId == "USER0" || data.userId == "VENDOR0") {
            existedUser = await Model.findOne({ email: data.body.email });
        } else {
            existedUser = await Model.findById(data.userId);
        }
        if (!existedUser) {
            return new DBerror(500, "User not found")
        }
        try {
            const verifyPassword = await existedUser.compareThisPassword(data.body.password)
            if (verifyPassword) {
                return verifyPassword;
            }
            else {
                return false;
            }

        } catch (error) {
            return new DBerror(500, "Error in password verification", error)
        }

    } catch (error) {
        return new DBerror(500, "Error in password verification", error)

    }

})

const updateOne = asyncHandler(async (data) => {

    try {
        console.log("after this one")
        let Model = modelsMap[data.Model];
        const existedUser = Model.findById(data.userId)
        if (!existedUser) {
            return new DBerror(500, "User not found")
        }
        return await existedUser.updateOne(data.body)

    } catch (error) {
        return new DBerror(500, "Error in updating", error)
    }

})

const getAccessToken = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const existedUser = await Model.findById(data.userId)
        if (!existedUser) {
            return new DBerror(500, "User not found")
        }
        return await existedUser.generateAccessToken()
    } catch (error) {
        return new DBerror(500, "Error in getting access token", error)
    }
})

const getRefreshToken = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model]
        const existedUser = await Model.findById(data.userId)
        if (!existedUser) { 
            return new DBerror(500, "User not found")
        }
        const refreshToken = await existedUser.generateRefreshToken()
        existedUser.refreshToken = refreshToken
        await existedUser.save({ validateBeforeSave: false })
        return refreshToken
    } catch (error) {
        return new DBerror(500, "Error in getting refresh token  ", error)
    }
})

const verifyAccessToken = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const decodedToken = jwt.verify(data.body.token, process.env.ACCESS_TOKEN_SECRET);
        if (!decodedToken) {
            return new DBerror(500, "Invalid Token")
        }
        const existedUser = await Model.findById(decodedToken._id)
        if (!existedUser) {
            return new DBerror(500, "User not found")
        }
        return existedUser;
    } catch (error) {
        return new DBerror(500, "Error in verifying access token", error)
    }


})

const verifyRefreshToken = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const decodedToken = jwt.verify(data.body.token, process.env.REFRESH_TOKEN_SECRET);
        if (!decodedToken) {
            return new DBerror(500, "Invalid Token")
        }
        const existedUser = await Model.findById(decodedToken._id)
        if (!existedUser) {
            return new DBerror(500, "User not found")
        }
        return existedUser;
    } catch (error) {
        return new DBerror(500, "Error in verifying access token", error)
    }
})

const updateById = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const upadtedUser = await Model.findByIdAndUpdate(data.userId, data.body, { new: true })
        return upadtedUser;
    } catch (error) {
        return new DBerror(500, "Error in updating by id", error)
    }

})

const aggregationLine = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        convertKeysToObjectId(data.body, data.userId)
        const aggregatedPipeline = await Model.aggregate(data.body)
        return aggregatedPipeline;
    } catch (error) {
        return new DBerror(500, "Error in aggregation", error)
    }
})



const convertKeysToObjectId = (obj, keys) => {
    if (obj === null || typeof obj !== 'object') {
      return;
    }
  
    if (Array.isArray(obj)) {
      obj.forEach(item => convertKeysToObjectId(item, keys));
    } else {
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          if (keys.includes(key) && typeof obj[key] === 'string') {
            obj[key] = new mongoose.Types.ObjectId(obj[key]);
          }
          convertKeysToObjectId(obj[key], keys);
        }
      }
    }
  };



export {find, creation, ifexists, ifexistsById, comparePass, updateById, updateOne, getAccessToken, getRefreshToken, verifyAccessToken, verifyRefreshToken, aggregationLine }