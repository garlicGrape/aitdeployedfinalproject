
require('./db');
//require('./auth');

//const passport = require('passport');
const express = require('express');
const path = require('path');

const routes = require('./routes/index');
// const portfolios = require('./routes/portfolios');
// const portfolioComponents = require('./routes/portfolio-components');  //commenting out for now
require("dotenv").config({ silent: true });
const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// allow CORS, so React app on port 3000 can make requests to Express server on port 4000
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*"); // update to match the domain you will make the request from
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const cors = require("cors");
// allow incoming requests only from a "trusted" host
app.use(cors({ origin: process.env.FRONT_END_DOMAIN, credentials: true }));


// enable sessions
const session = require('express-session');
const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};

const User = require("./models/userModel");
app.use(session(sessionOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// passport setup
//app.use(passport.initialize());
//app.use(passport.session());

const bcrypt = require("bcrypt");
const saltRounds = 10;

const jwt = require("jsonwebtoken");
const passport = require("passport");
app.use(passport.initialize());

const { jwtOptions, jwtStrategy } = require("./jwt-config.js"); // import setup options for using JWT in passport
passport.use(jwtStrategy);

// ===================== SIGNUP ROUTE ======================

app.post("/signup", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;
  const passwordCheck = req.body.passwordCheck;

  if (!username || !password || !passwordCheck) {
    // no username or password received in the POST body... send an error
    res
      .status(401)
      .json({ success: false, message: `no username or password supplied.` });
  }
  if (password != passwordCheck) {
    //password doesn't match the password check
    res.status(401).json({ success: false, message: `passwords don't match` });
  }
  
  // encrypt the password and enter it into the database
  bcrypt.hash(password, saltRounds).then(function (hash) {
    const newUser = new User({ username: username, password: hash });
    newUser.save(function (err) {
      if (err) {
        console.log(err);
        if (err.name === "MongoServerError" && err.code === 11000) {
          // Duplicate username
          return res
            .status(422)
            .send({ success: false, message: "User already exist!" });
        }
        // Some other error
        return res.status(401).send(err);
      }
      return res.json({ success: true, username: req.body.username });
    });
  });
});

// ===================== END SIGNUP ROUTE ======================

// ===================== LOGIN ROUTE ======================
app.post("/login", function (req, res) {
  const tUsername = req.body.username;
  const tPassword = req.body.password;

  if (!tUsername || !tPassword) {
    // no username or password received in the POST body... send an error
    res
      .status(401)
      .json({ success: false, message: `no username or password supplied.` });
  }

  User.findOne({ username: tUsername }, "password", function (err, users) {
    if (users == null || err)
      res.status(401).json({ success: false, message: `error` });
    else {
      const retPass = users.password;
      // assuming we found the user, check the password is correct
      bcrypt.compare(tPassword, retPass).then(function (result) {
        if (result) {
          const payload = { id: users.id }; // some data we'll encode into the token
          const token = jwt.sign(payload, jwtOptions.secretOrKey); // create a signed token
          res.json({ success: true, username: tUsername, token: token }); // send the token to the client to store
        } else {
          res
            .status(401)
            .json({ success: false, message: "passwords did not match" });
        }
      });
    }
  });
  return;
});

// ===================== END LOGIN ROUTE ======================

// make user data available to all templates
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

// Add this below all your other routes
if (process.env.NODE_ENV === 'production') {
  // Serve any static files
  app.use(express.static(path.join(__dirname, '../client/build')));
  // Handle React routing, return all requests to React app
  app.get('*', function(req, res) {
    res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
  });
}

/*app.get('/', (req, res) =>  {
  res.render('home');
});*/

app.use('/', routes);
// app.use('/portfolios', portfolios);
// app.use('/portfolio-items', portfolioComponents); //commenting out for now

//app.listen(3000); commenting out for now

app.listen(  process.env.PORT || 4000);
