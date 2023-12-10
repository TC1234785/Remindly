// importing express
const express = require("express");
// executes express like a function, will give us a function
// what this really is is an advanced server
const path = require("path");
const ejsLayouts = require("express-ejs-layouts");
const session = require("express-session");
const multer = require("multer");
const upload = multer({ dest: '/public/uploads'})
const app = express();


const reminderController = require("./controller/reminder_controller");
const authController = require("./controller/auth_controller");
const passport = require("./middleware/passport");
const { ensureAuthenticated } = require("./middleware/checkAuth");

app.use(express.urlencoded({ extended: false }));
app.use(ejsLayouts);

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));
// from express-session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false,
      maxAge: 24 * 60 * 60 * 1000,
    },
  })
);
//from Passport
app.use(passport.initialize());
app.use(passport.session());

// Routes start here
app.get("/reminders", reminderController.list);
app.get("/reminder/new", ensureAuthenticated, reminderController.new);
app.get("/reminder/:id", ensureAuthenticated, reminderController.listOne);
app.get("/reminder/:id/edit", ensureAuthenticated, reminderController.edit);
// upload.single will handle a single file upload w/ cover name
app.post("/reminder/", upload.single('cover'), reminderController.create);


// ⭐ Implement these two routes below!
app.post("/reminder/update/:id", reminderController.update);
app.post("/reminder/delete/:id", reminderController.delete);

// 👌 Ignore for now
app.get("/auth/register", authController.register);
app.post("/auth/register", authController.registerSubmit);
app.get("/auth/login", authController.login);
app.post(
  "/auth/login",
  passport.authenticate("local", {
    successRedirect: "/reminders",
    failureRedirect: "/auth/login",
  })
);

app.post("/revoke-session/:sessionId", (req, res) => {
  const { sessionId } = req.params;
  req.sessionStore.destroy(sessionId, (err) => {
    if (err) {
      console.log(err);
    } else {
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
    }
  });
});

app.get(
  "/auth/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

app.get(
  "/auth/github/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/reminders");
  }
);

// We are going to localhost:3001
app.listen(3001, function () {
  console.log(
    "Server running. Visit: http://localhost:3001/auth/login in your browser 🚀"
  );
});
