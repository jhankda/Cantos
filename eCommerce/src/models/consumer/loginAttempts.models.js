import mongoose,{Schema} from 'mongoose'
import mongooseAggregatePaginate  from 'mongoose-aggregate-paginate-v2';
// import { User } from './user.models'

const loginAttemptsSchema = new mongoose.Schema({
    customerId:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    loginTry:{
        type:Boolean,
        required:true,
        default:true
    },
    os:{
        type:String,
        required:true
    },
    browser:{
        type:String,
        required:true
    },

    loginTime:{
        type:Date,
        required:true,
        default:Date.now
    },
})

loginAttemptsSchema.plugin(mongooseAggregatePaginate)


export const LoginAttempts = mongoose.model("LoginAttempts",loginAttemptsSchema)