import mongoose,{Schema} from "mongoose";

const orderStatusCodeSchema = new mongoose.Schema({
    statusCode:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})

export const OrderStatusCode  = mongoose.model("OrderStatusCode",orderStatusCodeSchema)