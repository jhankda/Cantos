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
    length:60,

  },
  refreshToken:{
    type:String,

  },
  

},{timestamps:true})



userSchema.pre("validate", async function(next) {
  if(!(this.isModified("password"))) return next();
  console.log(this.password)

  const testpass = await  bcrypt.hash(this.password, 10)

  console.log(testpass)
  console.log(typeof testpass)
  this.password=testpass
  next()
})

userSchema.methods.compareThisPassword  = async function(password){
  console.log(this.password)

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