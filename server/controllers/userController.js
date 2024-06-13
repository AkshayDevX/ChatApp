const Message = require("../models/message");
const User = require("../models/user");
const catchAsyncErrors = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendToken = require("../utils/jwtToken");

// register a new user
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password, isAdmin } = req.body;

  if (!name || !email || !password) {
    return next(new ErrorHandler("Please enter all fields", 400));
  }

  const emailExists = await User.findOne({ email });
  if (emailExists) {
    return next(new ErrorHandler("User with this email already exists", 400));
  }

  const existingUser = await User.findOne({ name });
  if (existingUser) {
    return next(new ErrorHandler("User with this name already exists", 400));
  }

  const user = await User.create({
    name,
    email,
    password,
    isAdmin,
  });

  sendToken(user, 200, res);
});

// login user
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please enter email and password", 400));
  }

  const user = await User.findOne({ email });

  if (!user) {
    return next(new ErrorHandler("Invalid email or password", 401));
  }

  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler("Invalid Email or Password", 401));
  }
  sendToken(user, 200, res);
});

// logout user
exports.logoutUser = catchAsyncErrors(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: "Logged out",
  });
});

// get user profile
exports.getUserProfileLogin = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("-password");

  if (!user) {
    return next(new ErrorHandler("User not found", 404));
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// get all users
exports.getAllUsers = catchAsyncErrors(async (req, res, next) => {
  const users = await User.find().select("-password");

  res.status(200).json({
    success: true,
    users,
  });
});


// get all messages
exports.getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const Id = req.user.id;

  const messages = await Message.find({
    $or: [
      { from: Id },
      { to: Id },
    ],
  })

  res.status(200).json({
    success: true,
    messages,
  });

});