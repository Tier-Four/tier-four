const express = require('express');
const pool = require('../modules/pool');
const router = express.Router();
const rp = require('request-promise')

let userList = []
let today = new Date(); // today's date
let startDate = new Date().setDate(today.getDate()-30); // 30 days from today's date
let date = new Date(startDate); // date formatted
console.log('startDate total is : ', startDate);
console.log('date is : ', date);
date = JSON.stringify(date); // turns date into something .substring can handle 
let actualDate = date.substring(1,11);
console.log('this is the actual date: ', actualDate);

router.get('/get-gh-data', (req, res)=>{
    console.log('getting gh data');
    const requestPromises = []
    userList.forEach(user=>{
        const requestOptions = {
            uri: `https://api.github.com/search/commits?q=committer:${user.github}+committer-date:>${actualDate}&sort=committer-date&per_page=100`,
            headers : {"User-Agent": user.github, Accept: 'application/vnd.github.cloak-preview+json'},
            method: 'GET',
            json: true
        }
        requestPromises.push(rp(requestOptions));      
    })
    Promise.all(requestPromises)
    .then((data)=>{
        res.send(data);
    })
    .catch((error)=>{
        res.sendStatus(500);
        console.log(error);
    })
})

router.get('/get-user-list', (req, res) => {
    console.log('getting user list');
    const queryText = 'SELECT * FROM "users" WHERE "active" = TRUE';
    pool.query(queryText)
        .then((response) => {
            userList = response.rows
            res.send(userList)
        })
        .catch((error) => {
            console.log('error on get-user-list', error);
        })
})

/**
 * POST route template
 */
router.post('/', (req, res) => {

});

module.exports = router;