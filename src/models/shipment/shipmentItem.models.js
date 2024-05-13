import mongoose,{Schema} from "mongoose"

const shipmentItemSchema = new mongoose.Schema({
    orderId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Order"
    },
    shipmentId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Shipment"
    }
},{timestamps:true})

export const ShipmentItem  =  mongoose.model("ShipmentItem",shipmentItemSchema)