const ticketModel = (data, mongoose) => {

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