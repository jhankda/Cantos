import mongoose,{Schema} from "mongoose"

const orderItemReturnSchema  = new mongoose.Schema({
    orderItemId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"OrderItem"
    },
    returnId:{
        type:String,
        required:true,
        unique:true

    },
    issuedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    issuedat:{
        type:Date,
        required:true,
        default:Date.now
    }


    
},{timestamps:true})

orderItemReturnSchema.pre("save",function(next){
    this.returnId = `RET${Math.floor(1000 + Math.random() * 9000)}`
})



export const OrderItemReturn = mongoose.model("OrderItemReturn",orderItemReturnSchema)