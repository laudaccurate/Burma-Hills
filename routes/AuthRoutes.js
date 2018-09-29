const { createUser, logIn, logout } = require("../controllers/authController");
const { requireLogin, requireLogout } = require("../middleware");

module.exports = app => {
  app.get("/signup", requireLogout, (req, res, next) => {
    return res.render("signup");
  });

  app.post("/signup", createUser);

  app.get("/login", requireLogout, (req, res, next) => {
    return res.render("login");
  });

  app.post("/login", logIn);

  app.get("/logout", requireLogin, logout);
};
