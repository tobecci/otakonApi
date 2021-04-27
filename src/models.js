const initDb = () => {
    return new Promise((resolve, reject) => {
            let mongoose = require('mongoose');
            mongoose.connect('mongodb+srv://tobecci:developer@cluster0.jmf3p.mongodb.net/otakon?retryWrites=true&w=majority', 
            {useNewUrlParser: true, useUnifiedTopology: true})
            .then(() => {
            console.log("LINE 6: mongodb connected successfully");
            console.log("code that comes after connection");
            resolve(mongoose);
        })
        .catch(()=>{
            console.log("an error ocurred");
        })
    });
}

const ticketModel = (data) => {
    return new Promise((resolve, reject) => {
        console.log("initializing ticket model")
        initDb()
    .then((mongoose) => {
        console.log({mong:mongoose});
        const ticketSchema = mongoose.Schema({
        email: String,
        code: String,
        });
        const ticketModel = mongoose.model("ticket",ticketSchema);
        let model = new ticketModel(data);
        resolve(model);
    })
    })
}

module.exports = {
    ticketModel: ticketModel,
    init: initDb
}