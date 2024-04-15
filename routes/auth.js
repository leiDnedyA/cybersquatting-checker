const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const sanitize = require('../src/sanitize');

const UserModel = require('../models/User');

const router = express.Router();

router.use(bodyParser.urlencoded())

async function hashPassword(password) {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
}

async function comparePassword(plainPassword, hashedPassword) {
    const match = await bcrypt.compare(plainPassword, hashedPassword);
    return match;
}

passport.use(new LocalStrategy(async function verify(username, password, cb) {
  const sanitizedUsername = sanitize(username);
  const dbQuery = await UserModel.findOne({ username: sanitizedUsername }).exec();
  if(dbQuery === null) {
    return cb(null, false, { message: 'Incorrect username or password' });
  }
  if(await comparePassword(password, dbQuery.password))  {
    return cb(null, dbQuery);
  }
  return cb(null, false, { message: 'Incorrect username or password' });
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    const serializedUser = { username: user.username };
    cb(null, serializedUser);
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    return cb(null, user);
  });
});

async function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
     return next() 
  }
  res.status(401).send("Unauthorized, please log in.");
}

router.get('/login/test_auth', checkAuthenticated, (req, res) => {
  res.send('success');
});

router.get('/login', (req, res) => {
  res.send(`
      <h1>Sign in</h1>
      <form action="/login/password" method="post">
          <label for="username">Username</label>
          <input id="username" name="username" type="text" autocomplete="username" required autofocus>
          <label for="current-password">Password</label>
          <input id="current-password" name="password" type="password" autocomplete="current-password" required>
          <input type="submit">
      </form>
    `);
});

router.post('/login/password', passport.authenticate('local'), (req, res) => {
  res.json(req.user);
});

router.post('/login/signup', async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).send('Missing fields');
  }
  const sanitizedUsername = sanitize(req.body.username);
  const dbQuery = await UserModel.findOne({ username: sanitizedUsername }).exec();
  if (dbQuery !== null) {
    return res.status(401).send('Username already exists');
  }
  const user = {
    username: sanitize(req.body.username),
    password: await hashPassword(req.body.password),
  };

  const userInstance = new UserModel(user);
  await userInstance.save();

  req.login(user, err => {
    if (err) {return next(err)};
    res.status(200).send('Signup successful');
  })
});

module.exports = router;
