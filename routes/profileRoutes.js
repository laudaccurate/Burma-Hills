const mongoose = require("mongoose");
const { requireLogin } = require("../middleware");
const User = mongoose.model("User");

module.exports = app => {
  app.get("/users/dashboard", async (req, res, next) => {
    try {
      const user = await User.findById(req.session.userId);
      return res.render("dashboard", { user, title: "Dashboard" });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/users/profile", requireLogin, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.session.userId });
      console.log(user);
      return res.render("profile", { user, title: "Profile" });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/users/profile/update", requireLogin);

  app.get("/users/profile/dashboard", requireLogin, async (req, res, next) => {
    try {
      const user = await user.findOne({ _id: req.session.userId });
      return res.render("dashboard", { user });
    } catch (error) {
      return next(error);
    }
  });
};
