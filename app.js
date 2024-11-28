const express = require("express");
const dotenv=require("dotenv");
const path=require("path");
const socketio=require("socket.io");




const portexpress=process.env.portexpress||3000;
dotenv.config({path:"./.env"});
const publiccatalogspath=path.join(__dirname,"./public");
const app=express();



app.use(express.static(publiccatalogspath));
app.use(express.json());

app.get("/registration",(req,res)=>{
    const filepath=path.join(publiccatalogspath,"/pages/auth/registration.html");
    res.sendFile(filepath);
})
app.get("/login",(req,res)=>{
    const filepath=path.join(publiccatalogspath,"/pages/auth/login.html");
    res.sendFile(filepath);
})


app.listen(portexpress,()=>{
    console.log(`Działa...${portexpress}`);
})


