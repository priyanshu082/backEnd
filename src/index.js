import dotenv from 'dotenv'
import connectDB from "./db/index.js";

dotenv.config({
    path:'./.env'
})

connectDB()
.then(()=>{
    app.listen(process.env.PORT,()=>{
        console.log("Server is Running On ",process.env.PORT)
    })
})
.catch((err)=>{
    console.log("MONGODB connection Failed !!! ",err)
})





//we can also this in the way for connecting to data base  
//but we can do this by making everything in different folder
/*
import express from 'express'
const app=express();

//eefies
;(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        app.on("error",(error)=>{
            console.log("ERROR:",error);
            throw error
        })

        app.listen(process.env.PORT,()=>{
            console.log(`App is listening on PORT: ${process.env.PORT}`)
        })
    } catch (error) {
        console.log("ERROR:",error)
        throw err
    }
})()
*/