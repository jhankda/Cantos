import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const vendorSchema = new mongoose.Schema({
    companyCode:{
        type:String,
        required:true,
        unique:true
    },
    name:{
        type:String,
        required:true
    },
    
    description:{
        type:String,
        required:true
    },
    postalAddress:{
        type:String,
        required:true
        
    },
    country:{
        type:String,
        required:true,
        lowercase: true,
    },
    city:{
        type:String,
        required:true,
        lowercase: true,
    },
    password:{
        type:String,
        required:true,
        length:80
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
 

    }
,{timestamps:true})

vendorSchema.pre("validate", async function(next){
    if(!(this.isModified("password"))) return next();

    this.password = await bcrypt.hash(this.password, 12)

})



vendorSchema.methods.verifyPassword = async function(password){
    return await  bcrypt.compare(password,this.password)
}

vendorSchema.methods.generateAccessToken = function(){
    return jwt.sign(
        {
            _id:this._id,
            companyCode:this.companyCode,
            name:this.name,
        },
        process.env.VENDOR_ACCESS_TOKEN_SECRET,
        {expiresIn:process.env.VENDOR_ACCESS_TOKEN_EXPIRY}
    )
}






export const Vendor  = mongoose.model("Vendor",vendorSchema)