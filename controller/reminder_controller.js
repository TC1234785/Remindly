let database = require("../database");
const access_key = 'qz6IjWtEoTGZwEzdyiApKRJMBTWnpA2YrDdxrEsqkEI'

let remindersController = {
  list: (req, res) => {
    if (!req.user) {
      res.redirect('auth/login');
    } else {
      const sessions = req.sessionStore.sessions;
      console.log(sessions)
      const sessionArray = Object.entries(sessions).map(
      ([sessionId, sessionData]) => {
        const sessionObject = JSON.parse(sessionData);
        return {
          sessionId,
          expires: sessionObject.cookie.expires,
          user: sessionObject.passport ? sessionObject.passport.user : null,
        };
      });
      if (req.user.role === "admin") {
        res.render("reminder/admin", { sessions: sessionArray });
      } else {
        res.render("reminder/index", { reminders: req.user.reminders });
      }
    }
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: req.user.reminders });
    }
  },

  create: async (req, res) => {
    //reminder object
    let reminder = {
      id: req.user.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
      cover: ''
    };
    console.log(req.body);
    //checks if own photo is uploaded
    if (req.file) {
      //stores cover photo path
      reminder.cover = '/uploads/' + req.file.filename;
    }
    //if random photo checkbox true then
    else if(req.body.cover) {
      //git authorization to use api, fetch random photo
      const response = await fetch("https://api.unsplash.com/photos/random", {
        headers: {
          Authorization: `Client-ID ${access_key}`
        }
      });
      // convert data to json
	    const data = await response.json(); 
      // smallest photo size url
      reminder.cover = data.urls['thumb'];
    }
    
    req.user.reminders.push(reminder);
    res.redirect("/reminders");
  },

  

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = req.user.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    res.render("reminder/edit", { reminderItem: searchResult });
  },

  // Once they go and change the text of the reminder, you need to hit the update button
  // Goes into the database and updates the reminder within the database
  update: (req, res) => {
    // implementation here 👈
    console.log(req.body);
    // Find the reminder that has the same title
    let reminderToFind = req.params.id;
    let reminderIndex = req.user.reminders.findIndex(function (
      reminder
    ) {
      return reminder.id == reminderToFind;
    });
    if (reminderIndex !== -1) {
      // Update the reminder with the new title and description
      req.user.reminders[reminderIndex].title = req.body.title;
      req.user.reminders[reminderIndex].description =
        req.body.description;
      req.user.reminders[reminderIndex].completed =
        req.body.completed === "true";
      // Go back to the reminders page
      res.redirect("/reminders");
    }
  },

  // Just deletes the reminder that is listed
  delete: (req, res) => {
    // implementation here 👈
    // Find the reminder by id
    let reminderToFind = req.params.id;
    // using findIndex to go through the dictionary to find the first element that matches
    let reminderIndex = req.user.reminders.findIndex(function (
      reminder
    ) {
      // returns based on matched id
      return reminder.id == reminderToFind;
    });
    // ???
    if (reminderIndex !== -1) {
      // Gets rid of the reminder using the splice method and the index.
      // The value of 1 indicates only one item should be removed at this time.
      req.user.reminders.splice(reminderIndex, 1);
    }
    // go back to the reminders page when done
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
