let database = require("../database");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit: (req, res) => {
    let userFound = false;
    for (let user of database.database) {
      if (req.body.email === user.email && req.body.password === user.password) {
        userFound = true;
        break;
      }
    }

    if (userFound) {
      res.redirect("/reminders");
    } else {
      res.redirect("/auth/login");
    }
  },

  registerSubmit: (req, res) => {
    // implement later
  },
};

module.exports = authController;
