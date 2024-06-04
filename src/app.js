import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser';

const app=express();

 app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
 }))
 app.use(express.json({limit:"16kb"})) //for limiting the json data incoming
 app.use(express.urlencoded({extended:true,limit:"16kb"}))  //for configuring the data coming from url
 app.use(express.static("public"))
 app.use(cookieParser()) //for accessing cookies and setting the cookies in browser


 //(err,req,res,next) there are four things


export {app}