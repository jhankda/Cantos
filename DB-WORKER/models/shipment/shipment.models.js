import jwt from "jsonwebtoken"
import mongoose,{Schema} from "mongoose"

const shipmentSchema  = new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    toAddress:{
        type:String,
        required:true
    },
    fromAddress:{
        type:String,
        required:true
    },
    trackingNO:{
        type:String,
        required:true
    },
    sentAt:{
        type:Date,
        required:true
    },  
    receivedAt:{
        type:Date,
        required:true
    }
},{timestamps:true})

shipmentSchema.methods.generateTrackingNo  = function(){
    jwt.sign({
        _id:this._id,
    },process.env.TRACKING_NO_SECRET
    )
}

shipmentSchema.pre("save",function(next){
    this.trackingNo = this.generateTrackingNo()
})



export const Shipment  = mongoose.model("Shipment",shipmentSchema)