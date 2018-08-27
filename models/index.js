const mongoose = require("mongoose");
const UserSchema = require("./User");

const User = mongoose.model("User", UserSchema);
