const config = require("./config.js");
var paystack = require('paystack')(config.paystack.test.secret);
var QRCode = require('qrcode');
const models = require("./models.js");


const initControllers = (app) => {
    app.get("/", (req,res) =>{
        res.json({
            "route":"/",
            "event":"otakon titan 2021"
        })
    })
    
    app.get('/book', (req,res)=>{
        let body = req.query;
        let details = {
            amount:30000, 
            name: body.name, 
            email:body.email
        }
        // res.json({body:body});
        paystack.transaction.initialize(details)
        .then((body, error) => {
            if(error){
                throw new Error(error);
            }
            let {data} = body;
            res.redirect(data.authorization_url)
        });
    });   
    
    app.get('/paystack/callback', (req,res) => {
        console.log("callback successful");
        // console.log({req: req.query.reference});
        paystack.transaction.verify(req.query.reference)
        .then((body,error) => {
            // console.log(body);
            let {customer} = body.data;
            // console.log({customer:customer});
            ticket = {
                email: customer.email,
                code: customer.customer_code
            }
            console.log({ticket: ticket});
            //insert into database
            let newTicket =  models.ticketModel(ticket);
            newTicket.save((err, ticket) => {
                if(err) return console.log(err);
                console.log(ticket);
            })
        })
        res.send("payment succesfull");
    });

    app.get('/qr',(req,res)=>{
        QRCode.toDataURL('ojinakatochukwu@gmail.com', function (err, url) {
            // console.log(url)
            res.send(`<img src="${url}" />`)
          })
        
    })
}

module.exports = initControllers;