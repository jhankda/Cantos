import connectDB from "./db/index.js";
import dotenv from "dotenv";
import {app} from "./app.js";
import { handleResponse } from "./producer.js";



dotenv.config({
    path:'./env'
})

handleResponse()

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000,'0.0.0.0',()=> {
        console.log(`\n Server is running on port ${process.env.PORT || 8000}`)
    })
})
.catch((err) => {
    console.log('Error connecting to the database', err)
})

