import crypto from "crypto";
import { User } from "../models/userSchema.js";
import ErrorHandler from "../middlewares/error.js";
import { sendToken } from "../utils/jwtToken.js";
import { sendMail } from "../utils/sendMail.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncError.js";

// Verify Email
export const verifyEmail = catchAsyncErrors(async (req, res, next) => {
  const verificationToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  const user = await User.findOne({
    verificationToken,
    verificationTokenExpire: { $gt: Date.now() },
  });

  if (!user) {
    return next(new ErrorHandler("Invalid or expired verification token.", 400));
  }

  user.isVerified = true;
  user.verificationToken = undefined;
  user.verificationTokenExpire = undefined;
  await user.save();

  res.status(200).json({
    success: true,
    message: "Email verified successfully!",
  });
});

// Register User
export const register = catchAsyncErrors(async (req, res, next) => {
  const { name, email, phone, password, role } = req.body;
  if (!name || !email || !phone || !password || !role) {
    return next(new ErrorHandler("Please fill full form!"));
  }
  const isEmail = await User.findOne({ email });
  if (isEmail) {
    return next(new ErrorHandler("Email already registered!"));
  }
  const user = await User.create({
    name,
    email,
    phone,
    password,
    role,
  });

  const verificationToken = user.getVerificationToken();
  await user.save({ validateBeforeSave: false });

  const verificationUrl = `${req.protocol}://${req.get("host")}/api/v1/user/verify/${verificationToken}`;

  const message = `Hi ${name},\n\nPlease verify your email by clicking on the following link:\n\n${verificationUrl}\n\nThank you for joining us.`;

  try {
    await sendMail(email, "Email Verification", message);
    res.status(201).json({
      success: true,
      message: "Registration successful! Please check your email for verification.",
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    user.verificationToken = undefined;
    user.verificationTokenExpire = undefined;
    await user.save({ validateBeforeSave: false });
    
    // Provide more specific error message
    if (error.code === 'EAUTH') {
      return next(new ErrorHandler("Email authentication failed. Please try again later.", 500));
    } else if (error.code === 'ECONNECTION') {
      return next(new ErrorHandler("Email service temporarily unavailable. Please try again later.", 500));
    } else {
      return next(new ErrorHandler("Email could not be sent. Please try again later.", 500));
    }
  }
});

// Login User
export const login = catchAsyncErrors(async (req, res, next) => {
  const { email, password, role } = req.body;
  console.log("Login attempt:", { email, role }); // Debug log
  
  if (!email || !password || !role) {
    return next(new ErrorHandler("Please provide email, password, and role."));
  }
  
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    console.log("User not found:", email); // Debug log
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  
  const isPasswordMatched = await user.comparePassword(password);
  if (!isPasswordMatched) {
    console.log("Password mismatch for:", email); // Debug log
    return next(new ErrorHandler("Invalid Email Or Password.", 400));
  }
  
  if (user.role !== role) {
    console.log("Role mismatch:", { userRole: user.role, requestedRole: role }); // Debug log
    return next(new ErrorHandler(`User with provided email and ${role} not found!`, 404));
  }
  
  if (!user.isVerified) {
    console.log("User not verified:", email); // Debug log
    return next(new ErrorHandler("Please verify your email to log in.", 401));
  }
  
  console.log("Login successful for:", email); // Debug log
  sendToken(user, 201, res, "User Logged In!");
});

// Logout User
export const logout = catchAsyncErrors(async (req, res, next) => {
  res
    .status(201)
    .cookie("token", "", {
      httpOnly: true,
      expires: new Date(Date.now()),
    })
    .json({
      success: true,
      message: "Logged Out Successfully.",
    });
});

// Get User Details
export const getUser = catchAsyncErrors((req, res, next) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    user,
  });
});
