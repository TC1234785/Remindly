let database = require("../database");

let remindersController = {
  list: (req, res) => {
    res.render("reminder/index", { reminders: database.cindy.reminders });
  },

  new: (req, res) => {
    res.render("reminder/create");
  },

  listOne: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
      return reminder.id == reminderToFind;
    });
    if (searchResult != undefined) {
      res.render("reminder/single-reminder", { reminderItem: searchResult });
    } else {
      res.render("reminder/index", { reminders: database.cindy.reminders });
    }
  },

  create: (req, res) => {
    let reminder = {
      id: database.cindy.reminders.length + 1,
      title: req.body.title,
      description: req.body.description,
      completed: false,
    };
    database.cindy.reminders.push(reminder);
    res.redirect("/reminders");
  },

  edit: (req, res) => {
    let reminderToFind = req.params.id;
    let searchResult = database.cindy.reminders.find(function (reminder) {
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
    let reminderIndex = database.cindy.reminders.findIndex(function (reminder) {
      return reminder.id == reminderToFind; 
    })   
    if (reminderIndex !== -1) {
      // Update the reminder with the new title and description
      database.cindy.reminders[reminderIndex].title = req.body.title; 
      database.cindy.reminders[reminderIndex].description = req.body.description; 
      database.cindy.reminders[reminderIndex].completed = req.body.completed === "on";
      console.log(req.body.completed)
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
    let reminderIndex = database.cindy.reminders.findIndex(function (reminder) {
      // returns based on matched id 
      return reminder.id == reminderToFind;
    });
    // ???
    if (reminderIndex !== -1) {
      // Gets rid of the reminder using the splice method and the index. 
      // The value of 1 indicates only one item should be removed at this time. 
      database.cindy.reminders.splice(reminderIndex, 1);
    }
    // go back to the reminders page when done 
    res.redirect("/reminders");
  },
};

module.exports = remindersController;
