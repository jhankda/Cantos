import mongoose,{Schema} from 'mongoose'

const productCategorySchema = new mongoose.Schema({
   name:{
      type:String,
      required:true
   },
   code:{
    type:String,
    required:true,
    lowercase:true
   },
   description:{
    type:String,

   },
   parentCode:{
    type:String,
    required:true,
    lowercase:true
   }
  
},{timestamps:true})

export const ProductCategory  = mongoose.model("ProductCategory",productCategorySchema)

