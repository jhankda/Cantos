import mongoose,{Schema} from "mongoose";

const shoppingCartHistorySchema = new mongoose.Schema({
    actionconstant:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    }
},{timestamps:true})


export const ShoppingCartHistory  = mongoose.model("ShoppingCartHistory",shoppingCartHistorySchema)