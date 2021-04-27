const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://tobecci:developer@cluster0.jmf3p.mongodb.net/otakon?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const ticketModel = (data) => {
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
}