const initDb = () => {
    let mongoose = require('mongoose');
    mongoose.connect('mongodb+srv://tobecci:developer@cluster0.jmf3p.mongodb.net/otakon?retryWrites=true&w=majority', 
    {useNewUrlParser: true, useUnifiedTopology: true},
    (err)=>{
        if(err){
            console.log("mongo db could not connect: " + err);
        }
        console.log("mongodb connected");
        return mongoose;
        }
    )
}

const ticketModel = (data) => {
    console.log("initializing ticket model")
    let mongoose = initDb();
    console.log(mongoose);
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