import mongoose,{Schema} from 'mongoose'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema({
  userName:{
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
  }

  

},{timestamps:true})



userSchema.pre("save", async function(next) {
  if(!(this.isModified("password"))) return next();

  this.password = bcrypt.hash(this.password, 10)
  next()
})





export const User = mongoose.model("User",userSchema)