const User = require("./models/userModel");
//const mongoose = require('mongoose'),
    //passport = require('passport'),
    //LocalStrategy = require('passport-local').Strategy,
    //User = mongoose.model('User');

//passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

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


