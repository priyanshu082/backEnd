const express=require('express')
const app=express();
const port=8080;


app.get('/',(req,res)=>{
    res.send("Hellloooo")
})

app.listen(port,()=>{
    console.log(`Active on :- ${port}`)
})