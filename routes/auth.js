const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const crypto = require('crypto');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded())

const users = {
 // username : { password: "password", secret: "whatever" }
 "ayden": {id: "ayden", password: "pass", secret: "test"}
}

passport.use(new LocalStrategy(function verify(username, password, cb) {
  if(!users.hasOwnProperty(username)) {
    return cb(null, false, { message: 'Incorrect username or password' });
  }
  if(users[username].password === password)  {
    return cb(null, users[username]);
  }
  return cb(null, false, { message: 'Incorrect username or password' });
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    console.log(user)
    cb(null, { id: user.id, secret: user.secret });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
    console.log(user)
    return cb(null, user);
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
     return next() 
  }
  res.status(401).send("Unauthorized, please log in.");
}

router.get('/login/test_auth', checkAuthenticated, (req, res) => {
  res.send('success');
})

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

module.exports = router;
