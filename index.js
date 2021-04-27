const http = require("http");
const express = require("express");
const app = express();
const controllers = require("./src/controllers.js");

// init controllers
controllers(app);


app.listen(3000,()=>{
    console.log("app served on localhost:3000");
});