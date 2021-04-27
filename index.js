const http = require("http");
const express = require("express");
const app = express();
const controllers = require("./src/controllers.js");
const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://tobecci:developer@cluster0.jmf3p.mongodb.net/otakon?retryWrites=true&w=majority', 
{useNewUrlParser: true, useUnifiedTopology: true},
(err)=>{
    if(err){
        console.log("mongo db could not connect: " + err);
    }
    console.log("mongodb connected");
}
);

const port = process.env.PORT || 3000;

console.log({port:port})
// init controllers
controllers(app);
app.listen(port,()=>{
    console.log(`app served on port ${port}`);
});