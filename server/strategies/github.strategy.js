let passport = require('passport');
let Strategy = require('passport-github2').Strategy;
const pool = require('../modules/pool');

const debug = true;

passport.serializeUser(function(user, cb) {
    cb(null, user);
  });
  
  passport.deserializeUser(function(obj, cb) {
    cb(null, obj);
  });

//these are from the GitHub OAuth application
const CLIENT_ID = '69f62cd5606f940c16e1';
const CLIENT_SECRET = 'bfa6feba4bf473840752b9d1c49bf61cdd90d5e7';


passport.use( new Strategy({
    clientID: CLIENT_ID,
    clientSecret: CLIENT_SECRET,
    callbackURL: 'https://tier4.herokuapp.com/api/auth/github/callback' //this is set-up in the OAuth App on GitHub
  },
  function(token, tokenSecret, profile, cb) {
    //Do we have a user matching this in our Database?
    pool.query('SELECT * FROM users WHERE github = $1;', [profile.username]).then((result) => {
        //if not, enter that user into the database
        if(result.rows.length === 0) {
          pool.query('INSERT INTO users (name, github, image_url) VALUES ($1, $2, $3);',
                      [profile.displayName, profile.username, profile.photos[0].value])
            .then((result) => {
              if(debug){console.log('registered new user');};
              //then select that user from the database and then return that user
              pool.query('SELECT * FROM users WHERE github = $1;', [profile.username]).then((result) => {
                if(result.rows.length === 0) {
                  cb(null, false);
                } else {
                  let foundUser = result.rows[0];
                  if(debug){console.log('found user', foundUser);};
                  cb(null, foundUser);
                }
              }).catch((err) => {
                cb(null, false);
              })
            })
            .catch((err) => {
              if(debug){console.log('error in new user post', err);};
              cb(null, false);
            })
        } else { //if we DO have a user that matches this user, return that user
  
          let foundUser = result.rows[0];
          if(debug){console.log('found user', foundUser);};
          cb(null, foundUser);
        }
      }).catch((err) => {
        if(debug){console.log('error in new user post', err);};
        response.sendStatus(500);
        cb(null, false);
      })
  }));

module.exports = passport;