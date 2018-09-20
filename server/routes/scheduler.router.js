const express = require('express');
const nodemailer = require('nodemailer');
const router = express.Router();
const cron = require('node-cron')
const pool = require('../modules/pool');
const rp = require('request-promise')

let currentDate = new Date();
currentDate = JSON.stringify(currentDate)
currentDate = currentDate.substring(1, 11)
//gets the info for the latest challenges status. if the challenge was finished, we will be checking to see when the new challenge begins.

let userList = [];

router.get('/challenge-status', (req, res) => {
    res.send(didChallengeFinishRecently)
}) //endpoint for checking if a challenge recently finished so we can congradulate those who finished the challenge.

let transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    auth: {
        user: 'NODEMAILER_EMAIL',
        pass: 'NODEMAILER_PASSWORD'
    },
    // for handling request from local host 
    tls: {
        rejectUnauthorized: false
    }
}); //creates an email transporter.

//ALL THE NODECRON STUFF IS AT THE BOTTOM. THESE FUNCTIONS RUN AT SPECIFIC TIMES THROUGHOUT THE DAY. 

function dailyEmail() {
    pool.query(`SELECT "github", "email" FROM "users" WHERE "daily_email_reminders" = true;`) //retrieve a list of users who have subscribed to the daily reminder email.
        .then((response) => {


            userList = response.rows //create a userList which will be used to search the github api to see if the user has committed today.


            callApi(userList.shift())

        })
}

function callApi(user) {
    const requestPromises = [] //creates an array of requests we are going to send to the api.
    const requestOptions = {
        uri: `https://api.github.com/search/commits?q=committer:${user.github}+committer-date:${currentDate}&sort=committer-date&per_page=1`,
        headers: { "User-Agent": user.github, Accept: 'application/vnd.github.cloak-preview+json', Authorization: 'GITHUB_API_AUTHORIZATION_TOKEN' },
        method: 'GET',
        json: true
    }
    requestPromises.push(rp(requestOptions)); //push each request to the array
    Promise.all(requestPromises) //promise and wait for each request to complete
        .then((data) => {

            //create our finalized mailList

            if (data[0].total_count === 0) {

                const output = `<p>hey, ${user.github} just a friendly reminder to Commit and Push to Github everyday! There's a spot on the leaderboard with your name on it!</p>`;

                // setup email data with unicode symbols
                let mailOptions = {
                    from: 'Prime Tier 4 Staff', // sender address
                    to: user.email, // list of receivers
                    subject: 'Remember to Commit and Push!', // Subject line
                    text: `Just a friendly reminder to Commit!`, // plain text body
                    html: output // html body
                }; //send email to all those on the mailList

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        return console.log(error);
                    }
                    console.log('Message sent: %s', info.messageId);
                    console.log('info rawL ', info);
                    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    console.log('email has been sent');
                });
            } //if the user in the tempMailList has no commit for the day, push them to the mailList, 

            if (userList.length !== 0) {
                setTimeout(() => callApi(userList.shift()), 5000)
            }
        })
}



function weeklyEmail() { //send weekly feedback email
    pool.query(`SELECT "email" FROM "users" WHERE "weekly_email_reminders" = true;`) //grab all users who are subscribed to the weekly feedback email.
        .then((response) => {

            let mailList = [];
            response.rows.forEach(user => {
                mailList.push(user.email)
            }) //send them to the mailList array

            //adjust email content


            const output = `<p>Hey Prime Alumns, remember to log in to tier 4 to do your feedback! Let us know how the job search is going and what you've
                    been working on in your time since prime!</p>
        
                <br></br>
        
                <p>Follow us on Social Media!
                    <br>
            
                <a href="https://www.facebook.com/primedigitalacademy">Facebook</a>
                <br>
                <a href="https://www.instagram.com/goprimeacademy">Instagram</a>
                <br>
                <a href="https://www.linkedin.com/school/prime-digital-academy/">LinkedIn</a>
            </p>`;

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'Prime Tier 4 Staff', // sender address
                to: mailList, // list of receivers
                subject: 'Feedback', // Subject line
                text: '', // plain text body
                html: output // html body
            }; //send email to all those on the mailList

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('info rawL ', info);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                console.log('email has been sent');
            });
        })
}

function weeklyUpdates() {
    pool.query(`SELECT "users"."name", "users"."email", "weekly_progress_form".applied, "weekly_progress_form".learned, "weekly_progress_form".built, "weekly_progress_form".followed_up, "weekly_progress_form".events_networking  FROM "weekly_progress_form"
    JOIN "users" ON "users"."id" = "weekly_progress_form"."user_id";`)
        .then((response) => {

            //send them to the mailList array

            //adjust email content
            let output = '';

            response.rows.forEach(user=>{
                output += `<p>name: ${user.name} email: ${user.email} applied: ${user.applied} learned: ${user.learned} built: ${user.built} followed up: ${user.followed_up} networking: ${user.events_networking}     </p>`
            })

            
            console.log('this is the output',output);
            
            // const output = `<p>${JSON.stringify(response.rows)}</p>`; //temporary

            // setup email data with unicode symbols
            let mailOptions = {
                from: 'Tier Four App', // sender address
                to: 'PRIME_STAFF_EMAIL', // INSERT careers@primeacademy.io HERE
                subject: 'Weekly Alumni Feedback', // Subject line
                text: '', // plain text body
                html: output // html body
            }; //send email to all those on the mailList

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message sent: %s', info.messageId);
                console.log('info rawL ', info);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                console.log('email has been sent');
            });

            pool.query(`DELETE FROM "weekly_progress_form";`)
                .then((response))
        })
}

//daily email function '0 18 * * * '
cron.schedule('0 0 18 * * * ', function () {
    dailyEmail();
}); //run the daily email function once a day

//dailyEmail();

cron.schedule('0 0 18 * * Thursday', function () {

    weeklyEmail();

}); //run the weekly email function once a week

cron.schedule('0 0 10 * * Friday', function () {

    weeklyUpdates();
});

module.exports = router;