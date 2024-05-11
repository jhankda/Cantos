import mongoose,{Schema} from 'mongoose'
// import { User } from './user.models'

const loginAttemptsSchema = new mongoose.Schema({
    customerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:User,
        required:true
    },
    loginTry:{
        type:Boolean,
        required:true,
        default:false
    },
    loginTime:{
        type:Date,
        required:true,
        default:Date.now
    },
},{timestamps:true})


export const LoginAttempts = mongoose.model("LoginAttempts",loginAttemptsSchema)