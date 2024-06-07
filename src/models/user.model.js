import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'


const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
        index:true,  //used for searchings 
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    fullName:{
        type:String,
        required:true,
        lowercase:true,
        trim:true,
    },
    avatar:{
        type:String,  //cloudinary url
        required:true,
    },
    coverImage:{
        type:String,
    },
    watchHistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    password:{
        type:String,
        required:true
    },
    refreshToken:{
        type:String
    }

},{timestamps:true})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=await bcrypt.hash(this.password,10)
    next()
})

//custom methods
userSchema.methods.isPasswordCorrect=async function(password){
   const response =await bcrypt.compare(password,this.password)
   return response
}


//accesstoken
userSchema.methods.generateAccessToken=async function(){
   return jwt.sign(
    {
    _id:this._id,
    email:this._id,
    username:this.username,
    fullName:this.fullName
   },
   process.env.ACCESS_TOKEN_SECRET,
   {
    expiresIn:process.env.ACCESS_TOKEN_EXPIRTY
   }
)
}


//we have less info in refresh token
userSchema.methods.generateRefreshToken=async function(){
    return jwt.sign(
        {
        _id:this._id,
       },
       process.env.REFRESH_TOKEN_SECRET,
       {
        expiresIn:process.env.REFRESH_TOKEN_EXPIRY
       }
    )
}



export const User=mongoose.model("User",userSchema)