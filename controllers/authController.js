const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const util = require("../util");
const User = mongoose.model("User");

const createUser = async (req, res, next) => {
  try {
    const { email, password, telephoneNumber } = req.body;
    const foundEmail = await User.findOne({ email });
    if (foundEmail) {
      return util.error("An account with same email already exists", next);
    }
    const foundTelephoneNumber = await User.findOne({ telephoneNumber });
    if (foundTelephoneNumber) {
      return util.error(
        "An account with same telephone number already exists",
        next
      );
    }

    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      ...req.body,
      password: hash
    });
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    res.locals.currentUser = user;
    return res.redirect("/users/dashboard");
  } catch (error) {
    return next(error);
  }
};

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return util.error("No user exists with the provided email", next);
    }

    const matching = await bcrypt.compare(password, user.password);
    if (!matching) {
      return util.error("Incorrect password", next, 403);
    }
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    return res.redirect("/users/dashboard");
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
