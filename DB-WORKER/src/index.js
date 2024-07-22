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
        console.log(data.body, "\n", Model, data.Model)
        const checkModel = await Model.findOne(data.body);

        if (checkModel) {
            return checkModel;
        }
        else {
            return false;
        }
    } catch (error) {
        throw new DBerror(500, "Error in finding", error)
        console.error('Error:', error)

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
            return false;
        }
    } catch (error) {
        throw new DBerror(500, "Error in finding by id", error)
        console.error('Error:', error)

    }
})

const creation = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        console.log(Model, data.body, data.Model)
        const createdModel = await Model.create(data.body);
        const ifexistModel = await Model.findById(createdModel._id);
        if (!ifexistModel) {
            throw new DBerror(500, "Error in creation")
        } else {
            return createdModel;
        }
    } catch (error) {
        console.error('Error:', error)
        // throw new DBerror(500,"Error in creation",error)
        return new DBerror(500, "Error in creation", error);
    }
}
)


const comparePass = asyncHandler(async (data) => {

    try {
        let Model = modelsMap[data.Model];

        console.log("-:-", Model, data.body, data.Model, data.body.password)
        console.log(Model, data.body.password)
        let existedUser;
        if (data.userId == "USER0") {
            existedUser = await Model.findOne({ email: data.body.email });
        } else {
            existedUser = await Model.findById(data.userId);
        }

        console.log("last check point", existedUser)

        try {
            const verifyPassword = await existedUser.compareThisPassword(data.body.password)
            if (verifyPassword) {
                return verifyPassword;
            }
            else {
                console.log("--- HHHH ----");
                return false;
            }

        } catch (error) {
            console.error("ERROR IN COMPARING PASSWORD", error)
        }

        console.log(verifyPassword);
    } catch (error) {
        console.error("Error:", error)
        return new DBerror(500, "Error in password verification", error)

    }

})

const updateOne = asyncHandler(async (data) => {

    try {
        console.log("after this one")
        console.log(typeof data.userId, data.userId)
        console.log("--")
        let Model = modelsMap[data.Model];
        const existedUser = Model.findById(data.userId)
        return await existedUser.updateOne(data.body)

    } catch (error) {
        console.error("Error:", error)
        return new DBerror(500, "Error in updating", error)
    }

})

const getAccessToken = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        const existedUser = await Model.findById(data.userId)
        return await existedUser.generateAccessToken()
    } catch (error) {
        console.error("ERROR in getAccessToken function", error)
        return new DBerror(500, "Error in getting access token", error)
    }
})

const getRefreshToken = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model]
        const existedUser = await Model.findById(data.userId)
        const refreshToken = await existedUser.generateRefreshToken()
        existedUser.refreshToken = refreshToken
        await existedUser.save({ validateBeforeSave: false })
        return refreshToken
    } catch (error) {
        console.error("ERROR in getRefreshToken function", error)
        return new DBerror(500, "Error in getting refresh token  ", error)
    }
})

const verifyAccessToken = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        console.log(data.body.token, process.env.ACCESS_TOKEN_SECRET)
        const decodedToken = jwt.verify(data.body.token, process.env.ACCESS_TOKEN_SECRET);

        const existedUser = await Model.findById(decodedToken._id)
        return existedUser;
    } catch (error) {
        console.error("ERROR in verifyAccessToken function", error)
        return new DBerror(500, "Error in verifying access token", error)
    }


})

const verifyRefreshToken = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        console.log(data.body.token, process.env.REFRESH_TOKEN_SECRET)
        const decodedToken = jwt.verify(data.body.token, process.env.REFRESH_TOKEN_SECRET);

        const existedUser = await Model.findById(decodedToken._id)
        return existedUser;
    } catch (error) {
        console.error("ERROR in verifyAccessToken function", error)
        return new DBerror(500, "Error in verifying access token", error)
    }
})

const updateById = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        console.log(data.Model)

        const upadtedUser = await Model.findByIdAndUpdate(data.userId, data.body, { new: true })
        console.log(upadtedUser)
        return upadtedUser;
    } catch (error) {
        console.error("ERROR in updateById function", error)
        return new DBerror(500, "Error in updating by id", error)
    }

})

const aggregationLine = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        console.log(Model)
        console.log(data.body, data.userId)

        convertKeysToObjectId(data.body, data.userId)

        console.log(data.body, data.userId)
        const aggregatedPipeline = await Model.aggregate(data.body)
        console.log(aggregatedPipeline)
        console.log(aggregatedPipeline[0])
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



export { creation, ifexists, ifexistsById, comparePass, updateById, updateOne, getAccessToken, getRefreshToken, verifyAccessToken, verifyRefreshToken, aggregationLine }