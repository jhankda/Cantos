import mongoose,{Schema} from 'mongoose'
import mongooseAggregatePaginate  from 'mongoose-aggregate-paginate-v2';

const productSchema  = new mongoose.Schema({
    name:{
        type:String,
        reqired:true,

    },
    productImage:{
        type:String,
        required:true
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

productSchema.plugin(mongooseAggregatePaginate)
export const Product  = mongoose.model("Product",productSchema)