import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser'

import VerifyEmailRouter from './routes/verifyEmail.routes.js'









const app  = express();
import  useragent  from 'express-useragent';


app.use(cookieParser());

app.use(express.json());

app.use(express.urlencoded({extended: true}));
app.use(express.static('public'))
app.use(useragent.express());

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))





app.use('/api/v1/User',VerifyEmailRouter)


export {app};