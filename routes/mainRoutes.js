const mongoose = require("mongoose");
const User = mongoose.model("User");
const { requireLogin, requireLogout } = require("../middleware");

module.exports = app => {
  app.get("/", (req, res, next) => {
    return res.render("landingPage");
  });
};
