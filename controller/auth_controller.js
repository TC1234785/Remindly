let database = require("../database");
let passport = require("../middleware/passport");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },
  //(request, response)
  loginSubmit: (req, res) => {
    passport.authenticate("local", {
      successRedirect: "/reminders",
      failureRedirect: "/auth/login",
    })(req, res);
    console.log(req.user);
    console.log("help me");
    // const user = userController.getUserByEmailIdAndPassword(req.body.email, req.body.password);
    // console.log(user);

    // if (user) {

    // }

    // let userFound = false;
    // for (let user of database.database) {
    //   if (req.body.email === user.email && req.body.password === user.password) {
    //     userFound = true;
    //     break;
    //   }
    // }

    // if (userFound) {
    //   res.redirect("/reminders");
    // } else {
    //   res.redirect("/auth/login");
    // }
  },

  registerSubmit: (req, res) => {
    // implement later
  },
};

module.exports = authController;
