const mongoose = require("mongoose");
const bcrypt = require("bcrypt-nodejs");
const mailer = require("nodemailer");
const util = require("../util");
const User = mongoose.model("User");

const transporter = mailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_EMAIL,
    pass: process.env.GMAIL_PASSWORD
  }
});

const createUser = async (req, res, next) => {
  try {
    const { fullName, email, password, confirmPassword } = req.body;
    console.log(req.body);

    if (!fullName || !email || !password || !confirmPassword) {
      return res.render("signup", {
        alertMessage: "Please, make sure all required fields are filled",
        messageType: "error",
        messageTitle: "Authentication Error"
      });
    }

    const foundEmail = await User.findOne({ email });

    if (foundEmail) {
      return res.render("signup", {
        alertMessage: "An account with the same email already exists",
        messageType: "error",
        messageTitle: "Authentication Error"
      });
    }

    const hash = await bcrypt.hashSync(password);
    const user = await User.create({
      ...req.body,
      password: hash
    });

    const token = jwt.encode({ id: user._id }, process.env.JWT_SECRET);

    const mail_options = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Burma-Hills Account Verification",
      text: `http://localhost:3000/verify-email?token=${token}`
    };

    // transporter.sendMail(mail_options, function(err, info) {
    //   if (err) {
    //     console.log(err);
    //     res.status(401).send({ success: false });
    //   } else {
    //     console.log(info);
    //     res.send({ success: true });
    //   }
    // });

    req.session.userId = user._id;
    req.session.userEmail = user.email;
    res.locals.currentUser = user;
    return res.redirect("/burma-hills/users/dashboard");
  } catch (error) {
    return next(error);
  }
};

async function verify_email(req, res) {
  const { id } = jwt.decode(req.query.token, process.env.JWT_SECRET);

  await User.findByIdAndUpdate(id, { $addToSet: { meta: "EMAIL_VERIFIED" } });

  res.status(401).send("good good good");
}

const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.render("login", {
        alertMessage: "No user exists with the provided email",
        messageType: "error",
        messageTitle: "Authentication Error"
      });
    }

    const matching = await bcrypt.compareSync(password, user.password);
    if (!matching) {
      return res.render("login", {
        alertMessage: "Incorrect Passwords",
        messageType: "error",
        messageTitle: "Authentication Error"
      });
    }
    req.session.userId = user._id;
    req.session.userEmail = user.email;
    return res.redirect("/burma-hills/users/dashboard");
  } catch (error) {
    console.log("Error :", error);
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
  verify_email,
  logIn,
  logout
};
