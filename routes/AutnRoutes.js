module.exports = app => {
  app.get("/", (req, res, next) => {
    return res.render("landingPage");
  });

  app.get("/burma-hills/users/signup", (req, res, next) => {
    return res.render("signup");
  });

  app.post("/burma-hills/users/signup", (req, res, next) => {});

  app.get("/burma-hills/users/login", (req, res, next) => {
    return res.render("login");
  });

  app.get("/burma-hills/users/profile", (req, res, next) => {
    return res.render("profile");
  });
};
