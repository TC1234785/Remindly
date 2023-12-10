const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controller/userController");
const GitHubStrategy = require("passport-github2").Strategy;
const userModel = require("../database").userModel;

const GITHUB_CLIENT_ID = "8422f9714f621a85a250";
const GITHUB_CLIENT_SECRET = "fa49bd8b3c5c3cb58f4037e86618b8ad11cb4bb8";

const githubLogin = new GitHubStrategy(
  {
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://localhost:3001/auth/github/callback",
  },
  function (accessToken, refreshToken, profile, done) {
    //checks if github id is in database
    let user = userController.getUserById(profile.id)
    if (user) {
      return done(null, user)
      //if not create a new db user and login
    } else {
      userModel.createUser(profile)
      let user = userController.getUserById(profile.id)
      return done(null, user)
    }
  }
);

const localLogin = new LocalStrategy(
  {
    //using email instead of username
    usernameField: "email",
    passwordField: "password",
  },
  //function to check if login is in database
  (email, password, done) => {
    //leads to userController.js
    const user = userController.getUserByEmailIdAndPassword(email, password);
    //call done function, return user or false
    if (user) {
      return done(null, user);
    } else {
      done(null, false, {
        message: "Your login details are not valid. Please try again",
      });
    }
  }
);
//creates a new session using user.id (req.session.passport.user)
//stores user info in req.user
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
//when refreshing page, function takes info stored in serializeUser (userid) to lookup in database
passport.deserializeUser(function (id, done) {
  let user = userController.getUserById(id);
  if (user) {
    done(null, user);
  } else {
    done({ message: "User not found" }, null);
  }
});
//use own local strategy
module.exports = passport.use(localLogin).use(githubLogin);
