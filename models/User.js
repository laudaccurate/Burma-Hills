const mongoose = require("mongoose");
const { Schema } = mongoose;

const UserSchema = new Schema({
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, unique: true },
  dateOfBirth: { type: Date, required: true },
  profession: { type: String, required: true, trim: true },
  houseNumber: { type: String, required: true, trim: true, unique: true },
  familySize: Number,
  password: { type: String, required: true },
  gender: { type: String, required: true, trim: true },
  telephoneNumber: { type: String, required: true, unique: true },
  gallery: [String],
  bio: String
});

module.exports = UserSchema;
