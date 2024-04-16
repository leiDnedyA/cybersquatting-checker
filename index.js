const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

require('dotenv').config();
mongoose.set("strictQuery", false);

const { scheduleAllJobs } = require('./src/scheduling');

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI = process.env.MONGODB_CONNECTION_URI || "mongodb://127.0.0.1:27017/cybersquatting-checker";

app.use(cors());
app.use(express.json());

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  cookie: { secure: false }, /* Note: this should be changed when no longer prototyping */
  saveUninitialized: true
}));

/* Middleware */

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.use(passport.authenticate('session'));

/* Routes */

app.use(express.static(path.join(__dirname, './frontend/dist/')));
app.use('/', authRouter)
app.use('/', passport.authenticate('session'), apiRouter);

mongoose.connect(MONGODB_URI).then(async () => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
  console.log('scheduling jobs...');
  await scheduleAllJobs();

})
