import mongoose,{Schema} from 'mongoose'

const productSchema  = new mongoose.Schema({
    name:{
        type:String,
        reqired:true,

    },
    sku:{
        type:String,
        required:true,
        unique:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    vendorId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Vendor",
    },
    categoryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"productCategory"
    }
    

},{timestamps:true})

export const Product  = mongoose.model("Product",productShema)