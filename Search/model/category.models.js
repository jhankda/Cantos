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
    default:`get related products `
   },
   parentCode:{
    type:String,
    lowercase:true
   }
  
})

export const ProductCategory  = mongoose.model("ProductCategory",productCategorySchema)

