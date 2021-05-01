const http = require("http");
const express = require("express");
var cors = require('cors');
const app = express();
const controllers = require("./src/controllers.js");
const port = process.env.PORT || 3000;
const models = require("./src/models.js");
// const handlebars = require("express-handlebars");


models().then((models) => {
    //use cors
    app.use(cors());
    
    app.set('views','./views');
    app.set('view engine', 'ejs');
    app.use(express.static('public'));
    controllers(app, models);
    console.log({port:port})
    app.listen(port,()=>{
        console.log(`app served on port ${port}`);
    });
});

