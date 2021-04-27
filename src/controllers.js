const config = require("./config.js");
var paystack = require('paystack')(config.paystack.test.secret);
var QRCode = require('qrcode');
const models = require("./models.js");
const nodemailer = require("nodemailer");
const { ticketModel } = require("./models.js");


const sendEmail = (email) => {
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

        QRCode.toDataURL(email, async function (err, url) {
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
        })
}

const initControllers = (app, mongoose) => {
    app.get("/", (req,res) =>{
        res.json({
            "route":"/",
            "event":"otakon titan 2021"
        })
    })
    
    app.get('/book', (req,res)=>{
        
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
            console.log("inserting into db");
            console.log({ticket:ticketModel,mongoose:mongoose});
            let newTicket =  models.ticketModel(ticket,mongoose);
            console.log({newTicket: newTicket});

            newTicket.save((err, ticket) => {
                if(err) return console.log(err);
                console.log(`sending email`);
                sendEmail(ticket.email);
            })
        })
        res.send("payment succesfull");
    });
}

module.exports = initControllers;