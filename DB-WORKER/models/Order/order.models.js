import mongoose,{Schema} from 'mongoose'

const orderSchema  = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    statusCode:{
        type:String,
        required:true
    },
    comments:{
        type:String,
        required:true
    }

},{timestamps:true})

export const Order = mongoose.model("Order",orderSchema)