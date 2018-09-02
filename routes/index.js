module.exports = app => {
  require("./AuthRoutes")(app);
  require("./mainRoutes")(app);
  require("./profileRoutes")(app);
};
