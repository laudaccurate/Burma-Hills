const mongoose = require("mongoose");
const User = mongoose.model("User");

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

  const updatedUser = await User.findByIdAndUpdate(
    req.session.userId,
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

module.exports = { updateProfile };
