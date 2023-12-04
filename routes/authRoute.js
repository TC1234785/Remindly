const express = require("express");
const passport = require("../middleware/passport");
const { forwardAuthenticated } = require("../middleware/checkAuth");

const app = express.Router();
//if user is logged in and tried to go to login page
app.get("/auth/login", forwardAuthenticated, (req, res) => res.render("login"));

app.post(
  "/auth/login",
  //when auth/login is called authenticate sends info to local strategy(in passport.js)
  //calls login function that calls serializedUser(passport.js) to store user in session
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/auth/login",
  })
);

app.get('/auth/github',
passport.authenticate('github', { scope: [ 'user:email' ] }));

app.get('/auth/github/callback', 
passport.authenticate('github', { failureRedirect: '/login' }),
function(req, res) {
  // Successful authentication, redirect home.
  res.redirect('/');
});

// destorys session when logging out & redirect to login
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/auth/login");
});

module.exports = app;
