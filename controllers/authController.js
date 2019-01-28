const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const util = require("../util");
const User = mongoose.model("User");

const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    console.log(req.body);

    if (!fullName || !email || !password || !confirmPassword) {
      return res.render("signup", {
        errorMessage: "Please, make sure all required fields are filled"
      });
    }

    const foundEmail = await User.findOne({ email });

    if (foundEmail) {
      return res.render("signup", {
        errorMessage: "An account with the same email already exists"
      });
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hash
    });
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    res.locals.currentUser = user;
    return res.redirect("/burma-hills/users/dashboard");
  } catch (error) {
    return next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        errorMessage: "No user exists with the provided email"
      });
    }

    const matching = await bcrypt.compare(password, user.password);
    if (!matching) {
      return res.render("login", {
        errorMessage: "Incorrect Passwords"
      });
    }
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    return res.redirect("/burma-hills/users/dashboard");
  } catch (error) {
    console.log(error);
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    req.session.destroy(() => {
      return res.redirect("/");
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  createUser,
  logIn,
  logout
};
