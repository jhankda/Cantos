import mongoose,{Schema} from "mongoose";

const shoppingCartSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
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


export const ShoppingCart  = mongoose.model("ShoppingCart",shoppingCartSchema)