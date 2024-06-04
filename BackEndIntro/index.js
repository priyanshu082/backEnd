// const express =require('express')
import express from "express";
const app=express();
const port=8080;


app.get('/',(req,res)=>{
    res.send("<h1>Priyanshu</h1>")
})
 

app.listen(port,()=>{
    console.log(`Active o n :- ${port}`)
})  