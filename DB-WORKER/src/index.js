// crud operation starts
import { asyncHandler } from "../utils/asyncHandler.js"
import { modelsMap } from "../modelsMap.js"
import {DBerror} from "../utils/DBerror.js"

const ifexists  = asyncHandler(async (data)=> {
    try {
        const Model  = modelsMap[data.Model];
        console.log(data.body,"\n", Model,data.Model)

        const checkModel  = await Model.findOne(data.body);
    
        if(checkModel){
            return checkModel;
        }
        else{
            return false;
        }
    } catch (error) {
        throw new DBerror(500,"Error in finding",error)
        console.error('Error:',error)
        
    }
}) 

const ifexistsById  = asyncHandler(async (data)=> {
    try {
        const Model  = modelsMap[data.Model];
        const checkModel  =  await Model.findById(data.body.uniqueId);
        if(checkModel){
            return checkModel;
        }
        else{
            return false;
        }
    } catch (error) {
        throw new DBerror(500,"Error in finding by id",error)
        console.error('Error:',error)
        
    }
})

const creation = asyncHandler(async (data) => {
    try {
        const Model = modelsMap[data.Model];
        console.log(Model,data.body,data.Model)
        const createdModel  = await Model.create(data.body);
        const ifexistModel   = await Model.findById(createdModel._id);
        if(!ifexistModel){
            throw new DBerror(500,"Error in creation")
        }else{
        return createdModel;}
    } catch (error) {
        console.error('Error:',error)
        throw new DBerror(500,"Error in creation",error)
        return new DBerror(500,"Error in creation",error);
    }
})



export { creation , ifexists, ifexistsById}