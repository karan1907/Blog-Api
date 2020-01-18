const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const User = require("../models/User");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  // Get Signed Token
  const token = await user.getSignedJWT();

  res.status(200).json({ sucess: true, token });
});

exports.login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  //Check user
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  //Check if passwords Match
  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return next(new ErrorResponse("Invalid Credentials", 401));
  }

  //Create Token
  const token = await user.getSignedJWT();
  res.status(200).json({ sucess: true, token });
});
