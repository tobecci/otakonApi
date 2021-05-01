const config = require("./config.js");
// var paystack = require('paystack')(config.paystack.test.secret);
var paystack = require('paystack')(config.paystack.live.secret);
var QRCode = require('qrcode');
const nodemailer = require("nodemailer");


const sendEmail = (email) => {
    return new Promise((resolve, reject) => {
        console.log("sending email with qr for email " + email );
    let transporter = nodemailer.createTransport({
        host: "smtp.hostinger.com",
        port: 587,
        secure: false,
        auth: {
            user: "otakon@outdoors.ng",
            pass: "otakonEmailPassword0000@@@@",
        },
        });

        console.log({email:email});

        QRCode.toDataURL(`https://otakon-api.herokuapp.com/verify/${email}`, async function (err, url) {
        console.log(url)
        let htmlData = `
        <h1>Thank you For purchasing a ticket to the convention</h1>
        <p>Attached to this email is your unique pass code</p>
        <p>this will be scaned to grant you access to the event center</p>
        <p>seen you on Saturday May 1st, 2021</p>
        `;
        let info = await transporter.sendMail({
            from: "otakon@outdoors.ng", // sender address
            to: email,
            subject: "OTAKON-TITAN TICKET PURCHASE", // Subject line
            html: htmlData,
            attachments: [
                {
                    filename: "QR Code",
                    path: url
                }
            ]
            });
            console.log({info:info});
            resolve();
        })
    });
}

const getTicket = (email,models) => {
    return new Promise((resolve, reject) => {
        models.ticket.findOne({email: email}, (err, ticket) => {
            if(err) throw new Error(err);
            if(ticket === null) reject();
            resolve(ticket);
        })
    })
}


const initControllers = (app, models) => {

    console.log("controller code don start");

    app.get("/", (req,res) =>{
        res.json({
            "route":"/",
            "event":"otakon titan 2021"
        })
    })
    
    app.get('/book', (req,res)=>{

        //end ticket sales
        res.end("ticket booking is over");
        return;

        let body = req.query;
       if(body.email){
        let details = {
            amount:30000, 
            name: body.name, 
            email:body.email
        }
        paystack.transaction.initialize(details)
        .then((body, error) => {
            if(error){
                throw new Error(error);
            }
            let {data} = body;
            res.redirect(data.authorization_url)
        });
        return;
       }
       res.json({error:"did not supply data"});
    });   
    
    app.get('/paystack/callback', (req,res) => {
        console.log("callback successful");
        paystack.transaction.verify(req.query.reference)
        .then((body,error) => {
            let {customer} = body.data;
            ticket = {
                email: customer.email,
                code: customer.customer_code
            }
            console.log({ticket: ticket});

            //insert into database
            console.log("inserting into db");
            
            console.log({controllerModels: models});
            let ticketModel = models.ticket(ticket);

                ticketModel.save((err, ticket) => {
                    if(err) return console.log(err);
                    console.log(`sending email`);
                    sendEmail(ticket.email)
                    .then(() =>{
                        // res.end("payment succesfull");
                        res.redirect("https://otakontitan.netlify.app/booking-success");
                    }).catch(err => console.log(err))
                })
        })
    });

    app.get('/test', (req, res) => {
        res.render("test",{name:"tobecci"});
    });

    app.get('/registered', (req, res) => {
        models.ticket.find((err, tickets) => {
            res.render("purchasedTickets",{
                tickets:tickets
            });
        })
        // res.render("test",{name:"tobecci"});
    });

    app.get('/scanned', (req, res) => {
       models.scannedTicket.find((err, tickets) => {
            res.render("scannedTickets",{
                tickets:tickets
            });
        })
    });

    app.get('/verify/:email', (req, res) => {
        let email = req.params.email;
        console.log("verification route", {email:email});
        
        getTicket(email,models)
        .then((ticket) => {
            console.log("ticket exists");
            let data = {
                email: ticket.email,
                code: ticket.code
            };

            //save mark ticket as scanned
            let scannedTicket = new models.scannedTicket(data);
            console.log({scannedTicket:scannedTicket});
            scannedTicket.save((err, scannedTicket) => {
                if(err) throw err;
                console.log("scanned ticket saved");

                //delete old ticket
                ticket.delete((err, ticket) =>{
                    if(err) throw new Error(err);
                    console.log("ticket deleted");
                })
            });
            res.render("scanPass");
        })
        .catch(()=>{

            //ticket has already been scanned
            models.scannedTicket.findOne({email:email}, (err, ticket) => {
                if(ticket === null){
                    res.render("scanFail");
                    return;
                }
                res.render("scanned");
                return;
            })    
        });
       
        
        // res.json({email:email});
    });
}

module.exports = initControllers;