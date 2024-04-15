const express = require('express');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');

const router = express.Router();
router.use(bodyParser.urlencoded())

const users = {
 // username : { password: "password", secret: "whatever" }
 "ayden": {id: "ayden", password: "pass", secret: "test"}
}

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
  if(!users.hasOwnProperty(username)) {
    return cb(null, false, { message: 'Incorrect username or password' });
  }
  if(await comparePassword(password, users[username].password))  {
    return cb(null, users[username]);
  }
  return cb(null, false, { message: 'Incorrect username or password' });
}));

passport.serializeUser(function(user, cb) {
  process.nextTick(function() {
    cb(null, { id: user.id, secret: user.secret });
  });
});

passport.deserializeUser(function(user, cb) {
  process.nextTick(function() {
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
  if (users.hasOwnProperty(req.body.username)) {
    return res.status(401).send('Username already exists');
  }
  const user = {
    id: req.body.username,
    password: await hashPassword(req.body.password),
    secret: "new user"
  };
  users[req.body.username] = user;
  req.login(user, err => {
    if (err) {return next(err)};
    res.status(200).send('Signup successful');
  })
});

module.exports = router;
