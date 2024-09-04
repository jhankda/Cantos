import express from 'express';
import cors from 'cors';
import connectDB from './db/db.js';
import dotenv from 'dotenv';
import sercahRouter from './routes/routes.js';
dotenv.config({path:'./env'})

const app   = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static('public'))

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}
))


app.use('/api/v1/search',sercahRouter)


connectDB()
.then(()=>{
    app.listen(process.env.PORT || 7000,'0.0.0.0',()=> {
        console.log(`\n Server is running on port ${process.env.PORT || 7000}`)
    })
})
.catch((err) => {
    console.log('Error connecting to the database', err)
})