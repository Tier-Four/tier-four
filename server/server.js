
const express = require('express');
require('dotenv').config();

const app = express();
const bodyParser = require('body-parser');
const sessionMiddleware = require('./modules/session-middleware');

const passport = require('./strategies/github.strategy');

// nodeMailer transporter 
// const transporter = nodemailer.createTransport();

// Route includes
const userRouter = require('./routes/user.router');
const nodeMailerRouter = require('./routes/nodemailer.router');
const challengeRouter = require('./routes/challenge.router');
const authRouter = require('./routes/auth.router.js');
const feedbackRouter = require('./routes/feedback.router');
const ghRouter = require('./routes/gh-api.router.js');

// Body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Passport Session Configuration //
app.use(sessionMiddleware);

// start up passport sessions
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use('/api/user', userRouter);
app.use('/send', nodeMailerRouter);
app.use('/api/auth', authRouter);
app.use('/api/challenge', challengeRouter);
app.use('/api/feedback', feedbackRouter);
app.use('/api/gh-router', ghRouter);

// Serve static files
app.use(express.static('build'));

// App Set //
const PORT = process.env.PORT || 5000;

/** Listen * */
app.listen(PORT, () => {
  console.log(`Listening on port: ${PORT}`);
});


