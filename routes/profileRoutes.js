const mongoose = require("mongoose");
const { requireLogin } = require("../middleware");
const User = mongoose.model("User");
const path = require("path");
const multer = require("multer");
const {
  updateProfile,
  setProfilePhoto
} = require("../controllers/profileController");

const storage = multer.diskStorage({
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${path.extname(file.originalname)}`);
  },
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "..", "store"));
  }
});

const upload = multer({
  storage
});

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

  app.get(
    "/burma-hills/users/dashboard",
    requireLogin,
    async (req, res, next) => {
      try {
        const user = await User.findById(req.session.userId).lean();
        return res.render("dashboard", { user, title: "Dashboard" });
      } catch (error) {
        return next(error);
      }
    }
  );

  app.get(
    "/burma-hills/users/profile",
    requireLogin,
    async (req, res, next) => {
      try {
        const user = await User.findOne({ _id: req.session.userId });
        return res.render("profile", { user, title: "Profile" });
      } catch (error) {
        return next(error);
      }
    }
  );

  app.post("/burma-hills/users/updateProfile", requireLogin, updateProfile);

  app.post(
    "/burma-hills/users/updatePhoto",
    requireLogin,
    upload.single("profilePic"),
    setProfilePhoto
  );

  app.get("/users/:userId/viewProfile", requireLogin, (req, res, next) => {
    const user = req.user;
    return res.render("viewProfile", { user });
  });

  app.get(
    "/burma-hills/users/neighbours",
    requireLogin,
    async (req, res, next) => {
      try {
        const user = await User.findById(req.session.userId);
        const neighbours = await User.find({
          _id: { $ne: req.session.userId }
        });
        return res.render("neighbours", { neighbours, user });
      } catch (error) {
        return next(error);
      }
    }
  );

  app.get("/burma-hills/events", requireLogin, async (req, res, next) => {
    const user = await User.findOne({ _id: req.session.userId });
    return res.render("event", { user });
  });

  app.get(
    "/burma-hills/users/notifications",
    requireLogin,
    async (req, res, next) => {
      const user = await User.findOne({ _id: req.session.userId });
      const title = "Notifications";
      return res.render("notifications", { user, title });
    }
  );

  app.get("burma-hills/users/dues", (req, res, next) => {
    return res.render("dues");
  });
};
