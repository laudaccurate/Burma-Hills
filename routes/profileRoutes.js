const mongoose = require("mongoose");
const { requireLogin } = require("../middleware");
const User = mongoose.model("User");
const { updateProfile } = require("../controllers/profileController");

module.exports = app => {
  app.param("userId", async (req, res, next, id) => {
    try {
      const user = await User.findById(id);
      req.user = user;
      return next();
    } catch (error) {
      return next(error);
    }
  });

  app.get("/users/dashboard", requireLogin, async (req, res, next) => {
    try {
      const user = await User.findById(req.session.userId).lean();
      return res.render("dashboard", { user, title: "Dashboard" });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/users/profile", requireLogin, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.session.userId });
      return res.render("profile", { user, title: "Profile" });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/users/:userId/updateProfile", requireLogin, updateProfile);

  app.post("/users/:userId/updatePhoto", requireLogin, (req, res) => {
    return res.json("profile photo changed");
  });

  app.get("/users/profile/dashboard", requireLogin, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.session.userId });
      return res.render("dashboard", { user });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/users/:userId/viewProfile", requireLogin, (req, res, next) => {
    const user = req.user;
    return res.render("viewProfile", { user });
  });

  app.get("/users/neighbours", requireLogin, async (req, res, next) => {
    try {
      const user = await User.findById(req.session.userId);
      const neighbours = await User.find({ _id: { $ne: req.session.userId } });
      return res.render("neighbours", { neighbours, user });
    } catch (error) {
      return next(error);
    }
  });

  app.get("/burma-hills/events", requireLogin, async (req, res, next) => {
    const user = await User.findOne({ _id: req.session.userId });
    return res.render("events", { user });
  });
};
