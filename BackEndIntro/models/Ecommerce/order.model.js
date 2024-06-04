import mongoose from "mongoose";

const orderitemSchema=new mongoose.Schema({
    productId:{
        type:mongoose.Schema.Types,
        ref:"Product",
    },
    quantity:{
        type:Number,
        require:true,
    }
})

const orderSchema=new mongoose.Schema({
    orderPrice:{
        type:Number,
        required:true,
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    orderItems:{
         type:[orderitemSchema],  //it can be done in both ways
        // type:[
        //     {
        //         productId:{
        //             type:mongoose.Schema.Types,
        //             ref:"Product",
        //         },
        //         quantity:{
        //             type:Number,
        //             require:true,
        //         }
        //     }
        // ]
    },
    address:{
        type:String,
        required:true,
    },
    status:{
        type:String,
        enum:["PENDING","CANCELLED","DELIVERED"],
        default:"PENDING"
    }

},{timestamps:true})