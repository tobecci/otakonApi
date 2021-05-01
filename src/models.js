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

const ticketModel = (mongoose) => {
    return new Promise((resolve, reject) => {
        try {
            const ticketSchema = mongoose.Schema({
                email: String,
                code: String,
                });
                let ticketModel = mongoose.model("ticket",ticketSchema);
                resolve(ticketModel);
        } catch (error) {
            reject(error);
        }
    })
};

const scannedTicketModel = (mongoose) => {
    return new Promise((resolve, reject) => {
        try {
            const ticketSchema = mongoose.Schema({
                email: String,
                code: String,
                });
                let scannedTicketModel = mongoose.model("scannedTicket",ticketSchema);
                console.log("created the scanned ticket model", {scannedTicketModel:scannedTicketModel});
                resolve(scannedTicketModel);
        } catch (error) {
            reject(error);
        }
    })
};

const getAllModels = () => {
    return new Promise((resolve, reject) => {
        let models = {};
        
        initDb().then((mongoose) => {

        ticketModel(mongoose)
        .then((model) => {
            models.ticket = model;
            scannedTicketModel(mongoose)
            .then((scannedTicketModel) => {
                models.scannedTicket = scannedTicketModel;
                resolve(models);
            })
        })
    });
    })
}
module.exports = getAllModels;