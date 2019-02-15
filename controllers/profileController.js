const mongoose = require("mongoose");
const mailer = require("nodemailer");
const bcrypt = require("bcrypt-nodejs");
const User = mongoose.model("User");
const cloudinary = require("cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const updateProfile = async (req, res, next) => {
  let {
    fullName,
    email,
    houseNumber,
    dateOfBirth,
    telephoneNumber,
    bio,
    familySize,
    homePhone,
    facebook,
    twitter,
    instagram,
    profession
  } = req.body;

  const user = await User.findById(req.session.userId, {
    password: false,
    isAdmin: false
  })
    .lean()
    .exec();

  const updates = {};

  if (!email.trim()) {
    email = req.session.userEmail;
  }

  if (email !== undefined && email !== req.session.userEmail) {
    const existingUser = await User.findOne({ email: email.trim() });
    if (existingUser) {
      return res.render("profile", {
        message: "New email provided already exists",
        headerText: "Profile",
        ...user
      });
    }
  }

  // if (oldPassword.trim() && (!newPassword.trim() || !confirmPassword.trim())) {
  //   return res.render("profile", {
  //     ...user,
  //     headerText: "Profile",
  //     errorMessage: "Please enter new Password too"
  //   });
  // }
  // if (oldPassword.trim() && newPassword.trim() && confirmPassword.trim()) {
  //   const matching = await bcrypt.compare(oldPassword, user.password);

  //   if (!matching) {
  //     res.locals.message = "old passwords do not match";
  //     return res.render("profile", { headerText: "Profile", ...user });
  //   }

  //   if (newPassword !== confirmPassword) {
  //     return res.render("profile", {
  //       headerText: "Profile",
  //       errorMessage: "Passwords do not match",
  //       ...user
  //     });
  //   }

  //   const hash = await bcrypt.hash(newPassword, 10);
  //   updates.password = hash;
  // }

  const socialMedia = { facebook, twitter, instagram };

  updates.email = email;
  updates.profession = profession;
  updates.houseNumber = houseNumber;
  updates.bio = bio;
  updates.homePhone = homePhone;
  updates.familySize = familySize;
  updates.telephoneNumber = telephoneNumber;
  updates.fullName = fullName;
  updates.dateOfBirth = dateOfBirth;
  updates.socialMedia = socialMedia;

  const updatedUser = await User.findOneAndUpdate(
    { _id: req.session.userId },
    { ...updates },
    { new: true, select: { password: false, isAdmin: false } }
  )
    .lean()
    .exec();

  req.session.userEmail = updatedUser.email;

  return res.render("profile", {
    user: updatedUser,
    message: "Account info successfully changed"
  });
};

const setProfilePhoto = async (req, res, next) => {
  try {
    let result = await cloudinary.uploader.upload(req.file.path);

    const user = await User.findByIdAndUpdate(req.session.userId, {
      profilePic: result.url
    });

    console.log(user.profilePic);
    return res.render("profile", { user, title: "Profile" });
  } catch (error) {
    console.log("Error:", error);
  }
};

const requestPasswordChange = async (req, res) => {
  const token = jwt.encode({ id: user._id }, process.env.JWT_SECRET);

  try {
    const mail_options = {
      from: process.env.GMAIL_EMAIL,
      to: email,
      subject: "Burma-Hills Account Verification",
      text: `http://localhost:3000/?token=${token}`
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
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res) => {
  try {
    let { oldPassword, newPassword } = req.body;

    if (!oldPassword.trim() || !newPassword.trim()) {
      return res.render("change_password", {
        alertMessage: "All fields are required",
        messageType: "error",
        messageTitle: "Authentication Error"
      });
    }

    const user = await User.findById(req.session.userId);

    let matching = await bcrypt.compareSync(oldPassword, user.password);
    if (!matching) {
      return res.render("change_password", {
        alertMessage: " The password provided is incorrect",
        messageType: "error",
        messageTitle: "Authentication Error"
      });
    }

    newPassword = await bcrypt.hashSync(newPassword);
    await User.findByIdAndUpdate(user._id, { password: newPassword });

    return res.render("login", {
      alertMessage:
        " Your password has been successfully changed. Please login",
      messageType: "success",
      messageTitle: "Password Changed"
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  updateProfile,
  setProfilePhoto,
  requestPasswordChange,
  changePassword
};
