let express = require('express');
let passport = require('passport');
const pool = require('../modules/pool');
const router = express.Router();

router.get('/login', passport.authenticate('github', { failureRedirect: '/login' }))
  

router.get('/github/callback', 
  passport.authenticate('github', { failureRedirect: 'https://tier4.herokuapp.com/#/home' }),
  function(req, res) {
    res.redirect('https://tier4.herokuapp.com/#/home');
  });

router.get('/user', (req, res) => {
  pool.query(`SELECT * FROM users where id = $1`, [req.user.id]).then(response => {
    console.log('Req.user:', req.user, 'response', response.rows[0]);
    
    res.send(response.rows[0]);
  }).catch(err => {
    console.log(err);
    res.sendStatus(500);
    
  })
  
  
})

router.get('/profile',
  function(req, res){
    console.log('Profile', req.user);
    res.send(req.user)
  });

router.get('/logout', (req, res) => {
  // Use passport's built-in method to log out the user
  req.logout();
  res.sendStatus(200);
});

module.exports = router;