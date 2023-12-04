module.exports = {
  //If they are not logged in, but trying to go to a page that requires login, kick them to the login page
  ensureAuthenticated: function (req, res, next) {
    //checks if user has a session
    if (req.isAuthenticated()) {
      return next();
    } else {
      res.redirect("/auth/login");
    }
  },
  //If you are already logged in, it doesn't make sense for you to be able to see the login page
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
};
