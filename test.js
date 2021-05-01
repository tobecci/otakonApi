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

// let email = `estherdaniels79@gmail.com`;
// let email = `emeghara6@gmail.com`;
let email = `ojinakatochukwu@gmail.com`;

// sendEmail(email).then(() => {
//     console.log("hello");
// })

const models = require("./src/models.js");

let modelList = {};
models().then((models) => {
    let ticketModel = models.ticket;
    let ticket = {email: email, code: "randomestCode"};
    ticket = ticketModel(ticket);
    console.log({ticketModel: ticketModel, ticket: ticket});
    ticket.save((err, ticket) => {
        console.log(ticket);
    });
});