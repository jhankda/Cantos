import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
    lowercase: true,
  },
  middleName:{
    type:String,
    lowercase: true,
  },
  lastName:{
    type:String,
    required:true,
    lowercase: true,
  },
  email:{
    type:String,
    required:true,
    lowercase: true,
    unique:true
  },
  password:{
    type:String,
    required:true,
    lowercase: true,
  },
  refreshToken:{
    type:String,

  },
  

  

},{timestamps:true})



userSchema.pre("save", async function(next) {
  if(!(this.isModified("password"))) return next();

  this.password = bcrypt.hash(this.password, 10)
  next()
})

userSchema.methods.verifyPassword  = async function(password){
  return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateAccessToken  = function(){
  jwt.sign(
    {
      _id:this._id,
      firstName:this.firstName,
      lastName:this.lastName,
      email:this.email,

    }, process.env.ACCESS_TOKEN_SECRET,
    {expiresIn:process.env.ACCESS_TOKEN_EXPIRY}
  )
}

userSchema.methods.generateRefreshToken  = function(){
  jwt.sign({_id:this._id},
  process.env.REFRESH_TOKEN_SECRET,
  {expiresIn:process.env.REFRESH_TOKEN_EXPIRY}
  )
}






export const User = mongoose.model("User",userSchema)