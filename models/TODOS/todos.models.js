import mongoose from "mongoose";

const todoSchema=new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    complete:{
        type:Boolean,
        default:false,
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",   ///giving reference of created by and establishing that we will provdie data of any user
    },
    subTodos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"SubTodo",
        }
    ] //array of subtodos
},{timestamps:true})

export const Todo= mongoose.model("Todo",todoSchema)