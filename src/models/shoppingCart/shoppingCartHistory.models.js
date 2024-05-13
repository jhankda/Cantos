import mongoose,{Schema} from "mongoose";

const shoppingCartHistorySchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        Ref:"User"
    },
    productId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Product"
    },
    occuredAt:{
        type:Date,
        required:true,
        default:Date.now
    },
    actionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Action"
    }
    
    

},{timestamps:true})

export const  shoppingCartHistory =  mongoose.model("shoppingCartHistory",shoppingCartHistorySchema)