const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  dateOfBirth: { type: Date },
  profession: { type: String },
  houseNumber: { type: String },
  homePhone: { type: String },
  socialMedia: {
    facebook: { type: String },
    twitter: { type: String },
    instagram: { type: String }
  },
  familySize: Number,
  password: { type: String, required: true },
  telephoneNumber: { type: String },
  profilePic: { type: String },
  gallery: [String],
  bio: String
});

module.exports = UserSchema;
