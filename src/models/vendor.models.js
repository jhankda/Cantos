import mongoose,{Schema} from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const vendorSchema = new mongoose.Schema({
    companyCode:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    password:{
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
    }

    }
,{timestamps:true})

vendorSchema.pre("save", async function(next){
    if(this.isModified(password)) return next();

    this.password = bcrypt.hash(this.password,10) 
    next()
})

userSchema.methods.verifyPassword = async function(password){
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken = function(){
    jwt.sign(
        {
            _id:this._id,
            companyCode:this.companyCode,
            name:this.name,
            description:this.description
        }, 
        process.env.VENDOR_ACCESS_TOKEN_SECRET,

        {expiresIn:process.env.VENDOR_ACCESS_TOKEN_EXPIRY}
    )
    
}




export const Vendor  = mongoose.model("Vendor",vendorSchema)