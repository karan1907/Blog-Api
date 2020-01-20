const crypto = require("crypto");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const sendEmail = require("../utils/sendEmail");
const User = require("../models/User");

exports.register = asyncHandler(async (req, res, next) => {
  const { name, email, password } = req.body;

  const user = await User.create({ name, email, password });

  sendTokenResponse(user, 200, res);
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

  sendTokenResponse(user, 200, res);
});

//Sending JWT Cookie
const sendTokenResponse = (user, statusCode, res) => {
  //Create Token
  const token = user.getSignedJWT();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ sucess: true, token });
};

//Get Current Logged In User
exports.getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id);

  res.status(200).json({
    success: true,
    data: user
  });
});

//Forgot Password Token Generation
exports.forgotPassword = asyncHandler(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  //Check if user is registered
  if (!user) {
    return next(
      new ErrorResponse(
        `User with E-Mail : ${req.body.email} is not registered with us!`,
        404
      )
    );
  }

  //Generate Reset Token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });

  //Create Reset Url
  const resetURL = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/auth/resetpassword/${resetToken}`;

  //Message to Send
  const message = `You or someone else request for reset password request. Please
  go to the given url to confirm \n\n${resetURL}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password Reset",
      message
    });
    res.status(200).json({ success: true, data: "Email Sent" });
  } catch (err) {
    (user.passwordResetToken = undefined),
      (user.passwordResetTokenExpire = undefined),
      await user.save({ validateBeforeSave: false });

    return next(new ErrorResponse("Something went wrong", 401));
  }
});

// Reset Passowrd
exports.resetPassword = asyncHandler(async (req, res, next) => {
  //Get hashed token
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");

  const user = await User.findOne({
    passwordResetToken,
    passwordResetTokenExpire: { $gt: Date.now() }
  });

  if (!user) {
    return next(new ErrorResponse("Expired Token", 400));
  }

  // Set Password
  user.password = req.body.password;
  (user.passwordResetToken = undefined),
    (user.passwordResetTokenExpire = undefined);

  await user.save();

  sendTokenResponse(user, 200, res);
});

// Update Details of Logged In User
exports.updateDetails = asyncHandler(async (req, res, next) => {
  const fields = {
    name: req.body.name,
    email: req.body.email
  };
  const user = await User.findByIdAndUpdate(req.user.id, fields, {
    new: true,
    runValidators: true
  });

  res.status(200).json({ sucess: true, data: user });
});

// Update Password of logged in User
exports.updatePassword = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  //Check Current Password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorResponse("Invalid Password", 400));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});

//Grant Access to specific roles

exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new ErrorResponse("Not Authorized", 401));
    }
    next();
  };
};
