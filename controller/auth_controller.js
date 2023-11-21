let database = require("../database");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },

  loginSubmit: (req, res) => {
    console.log(database)
    // implement later
    
  },

  registerSubmit: (req, res) => {
    // implement later
  },
};

module.exports = authController;
