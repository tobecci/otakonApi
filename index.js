const http = require("http");
const express = require("express");
const app = express();
const controllers = require("./src/controllers.js");
const port = process.env.PORT || 3000;
const models = require("./src/models.js");

models().then((models) => {
    controllers(app, models);
    console.log({port:port})
    app.listen(port,()=>{
        console.log(`app served on port ${port}`);
    });
});

