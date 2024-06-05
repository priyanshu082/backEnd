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
    fullname:{
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
    refereshToken:{
        type:String
    }

},{timestamps:true})


userSchema.pre("save",async function(next){
    if(!this.isModified("password")) return next()
    this.password=bcrypt.hash(this.password,10)
    next()
})

//custom methods
userSchema.methods.isPasswordCorrect=async function(password){
   await bcrypt.compare(password,this.password)
}

export const User=mongoose.model("User",userSchema)