import mongoose,{Schema} from 'mongoose'

const productSchema  = mongoose.Schema({
  description:{
    type:String,
    required: true,
  },
  name:{
    type:String,
    required: true,
  },
  productImage:{
    type:String,
  },
  price:{
    type:Number,
    default:0,

  },
  Stock:{
    type:Number,
    default:0,
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    reg:"Category"
  },
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
  }

},{timestamps:true})

export const Product  = mongoose.model("Product",productShema)