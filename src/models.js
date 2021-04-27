const initDb = () => {
    let mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://tobecci:developer@cluster0.jmf3p.mongodb.net/otakon?retryWrites=true&w=majority', 
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then((err) => {
        console.log({err});
        console.log("mongodb connected successfully");
    })
}

const ticketModel = (data) => {
    console.log("initializing ticket model")

    (async() => {
        let mongoose = initDb();
    })()
    .then(() => {
        console.log("it has finished");
    });

    // console.log(mongoose);

    const ticketSchema = mongoose.Schema({
        email: String,
        code: String,
    });

    const ticketModel = mongoose.model("ticket",ticketSchema);
    let model = new ticketModel(data);
    return model;
}

module.exports = {
    ticketModel: ticketModel,
    init: initDb
}