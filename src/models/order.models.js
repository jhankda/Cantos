import mongoose,{Schema} from "mongoose"

const oredrItemsSchema  = mongoose.Schema({
  productId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Product"
  },
  quantity:{
    type:Number,
    required:true
  }
})

const orderSchema = model.Schema({
  orderPrice:{
    type:Number,
    required:true
  },
  customer:{
    type:mongoose.Schema.Types,
    ref:"User"
  },
  orderItems:{
    type:[oredrItemsSchema]
  },
  address:{
    type:String,
    required: true,
    lowercase: true
  },
  status:{
    type:String,
    enum:["PENDING","CANCELLED","DELIVERED"],//giving choices
    default:"PENDING"
  }

},{timestamps:true})

export  const Order  = mongoose.model("Order",orderSchema)