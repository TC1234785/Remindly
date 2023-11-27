const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const userController = require("../controller/userController");

/* const githubLogin = new GithubStrategy(
  passport.use(new GitHubStrategy({
    clientID: GITHUB_CLIENT_ID,
    clientSecret: GITHUB_CLIENT_SECRET,
    callbackURL: "http://127.0.0.1:3000/auth/github/callback"
  },
  function(accessToken, refreshToken, profile, done) {
    User.findOrCreate({ githubId: profile.id }, function (err, user) {
      return done(err, user);
    });
  }
))); */


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
    return user
      ? done(null, user)
      : done(null, false, {
          message: "Your login details are not valid. Please try again",
        });
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
module.exports = passport.use(localLogin);
