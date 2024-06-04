import mongoose from 'mongoose'

const userSchema=new mongoose.Schema(
{
    username:{
        type:String,
        required:true,
        unique:true,
        // lowercase:true,   many moreee
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:[true,"Password is required"],
        min:[6,"min character are 6"],
        max:12
    }
},{timestamps:true} // it will add two more fields i.e createdat  and updatedat
)

export const User=mongoose.model("User",userSchema) //it create a model in data base which take two parameter i.e Name and basis on which we want to create a schema
  