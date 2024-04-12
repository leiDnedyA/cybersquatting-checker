const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const apiRouter = require('./routes/api');

const app = express();
const port = process.env.PORT || 3001;

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
app.use(apiRouter);


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
