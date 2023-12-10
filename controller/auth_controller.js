let database = require("../database");
let passport = require("../middleware/passport");
const db = require("../database");

let authController = {
  login: (req, res) => {
    res.render("auth/login");
  },

  register: (req, res) => {
    res.render("auth/register");
  },
  //(request, response)
  loginSubmit: (req, res) => {
    // passport.authenticate("local", {
    //   successRedirect: "/reminders",
    //   failureRedirect: "/auth/login",
    // })(req, res);
    // console.log(req.user);
    // console.log("help me");
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
    console.log(req.body.email)
    let user = db.database.find((user) => user.email === req.body.email);
    if (user) {
      throw new Error(`${req.body.email} already registered`)
    } else {
      db.database.push({
        id: 10,
        name: "Joe Mama",
        email: req.body.email,
        password: req.body.password,
        reminders: [],
        role: "user",
      })
    }
    res.render("auth/login")

  },
  adminview: (req, res) => {
    if (req.user.role === "admin") {
     const sessions = req.sessionStore.sessions;
     const sessionArray = Object.entries(sessions).map(
       ([sessionId, sessionData]) => {
         const sessionObject = JSON.parse(sessionData);
         return {
           sessionId,
           expires: sessionObject.cookie.expires,
           user: sessionObject.passport ? sessionObject.passport.user : null,
         };
       }
       );
       res.render("reminder/admin", {sessions: sessionArray});
    } else {
     res.render("auth/admin")
    }
  },
};

module.exports = authController;
