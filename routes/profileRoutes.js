const mongoose = require("mongoose");
const { requireLogin } = require("../middleware");
const User = mongoose.model("User");

module.exports = app => {
  app.get("/profile", requireLogin, async (req, res, next) => {
    try {
      const user = await User.findOne({ _id: req.session.userId });
      console.log(user);
      return res.render("profile", { user });
    } catch (error) {
      return next(error);
    }
  });

  app.post("/profile/update", requireLogin);

  app.get("/dashboard", requireLogin, async (req, res, next) => {
    try {
      const user = await user.findOne({ _id: req.session.userId });
      return res.render("dashboard", { user });
    } catch (error) {
      return next(error);
    }
  });
};
