const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();

router.post('/', (req, res) => {
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        port: 465,
        secure: true,
        auth: {
            user: 'prime.tierfour@gmail.com',
            pass: 'jefftylermattmaiyer'
        },
        // for handling request from local host 
        tls: { 
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