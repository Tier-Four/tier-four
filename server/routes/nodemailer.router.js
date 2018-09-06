const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const nodeCron = require('node-cron');

let task = nodeCron.schedule('1 * * * * *', function () {
    console.log('RAWRRRR!!!!!!');
}, false);
// task.start();
router.post('/', (req, res) => {
    // let transporter = nodemailer.createTransport({
    //     host: 'mail.gmail.com',
    //     port: 587,
    //     secure: false, // true for 465, false for other ports
    //     auth: {
    //         user: 'prime.tierfour@gmail.com', // generated ethereal user
    //         pass: 'jefftylermattmaiyer'  // generated ethereal password
    //     },
    //     tls:{ // because from local host 
    //       rejectUnauthorized:false
    //     }
    //   });


    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'prime.tierfour@gmail.com',
            pass: 'jefftylermattmaiyer'
        },
        tls: { // because from local host, works without too
            rejectUnauthorized: false
        }
    });

    const mailList = [
        'leex4920@gmail.com'
    ];

    const output = `<p>hello world</p>`;

    // setup email data with unicode symbols
    let mailOptions = {
        from: '"Tier Four Development Team" <prime.tierfour@gmail.com>', // sender address
        to: mailList, // list of receivers
        subject: 'Testing nodeMailer', // Subject line
        text: 'Hello world?', // plain text body
        html: output // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
        console.log('info rawL ', info);
        console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
        res.render('contact', { msg: 'Email has been sent' });
    });
});

module.exports = router;