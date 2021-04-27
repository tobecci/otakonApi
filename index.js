const http = require("http");
const express = require("express");
const app = express();
const controllers = require("./src/controllers.js");
const port = process.env.PORT || 3000;

console.log({port:port})
// init controllers
controllers(app);
app.listen(port,()=>{
    console.log(`app served on port ${port}`);
});