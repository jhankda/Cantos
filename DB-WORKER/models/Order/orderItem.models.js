import mongoose,{Schema} from "mongoose";

const orderItemSchema = new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    quantity:{
        type:Number,
        required:true
    },
    price:{
        type:Number,
        required:true
    }
    
},{timestamps:true})

export const OrderItem  = mongoose.model("OrderItem",orderItemSchema)