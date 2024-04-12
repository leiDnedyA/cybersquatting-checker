const express = require('express');
const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const path = require('path');

require('dotenv').config();

const apiRouter = require('./routes/api');
const authRouter = require('./routes/auth');

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

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
     return next() 
  }
  res.status(401).send("Unauthorized, please log in.");
}


/* Routes */

app.use(express.static(path.join(__dirname, './frontend/dist/')));
app.use('/', authRouter)
app.use('/', checkAuthenticated, apiRouter);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
