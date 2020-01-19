const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please Provide a Name"],
    trim: true
  },
  email: {
    type: String,
    required: [true, "Please Provide an Email"],
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: [true, "Please Provide a password"],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ["user"],
    default: "user"
  },
  passwordResetToken: String,
  passwordResetTokenExpire: String,
  createdAt: {
    type: Date,
    default: Date.now()
  }
});

//Encrypt the password
UserSchema.pre("save", async function(next) {
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

//Get Signed JSON Web Token
UserSchema.methods.getSignedJWT = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRES
  });
};

//Check if passwords Match
UserSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", UserSchema);
