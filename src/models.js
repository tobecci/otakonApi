const initDb = async () => {
    let mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://tobecci:developer@cluster0.jmf3p.mongodb.net/otakon?retryWrites=true&w=majority', 
    {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        console.log("LINE 6: mongodb connected successfully");
        return mongoose;
    })
    .catch(()=>{
        console.log("an error ocurred");
        return null;
    })
}

const ticketModel = (data) => {
    console.log("initializing ticket model")

    let mongoose = initDb().then((db) => {
        console.log({db:db});
    })
    process.exit();
    // (async() => {
    //     console.log("LINE 18: connecting to mongo");
    //     let mongoose = initDb();
    // })()
    // .then(() => {
    //     console.log("LINE 22: it has finished");
    // });
    
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