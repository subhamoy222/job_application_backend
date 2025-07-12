//Purpose: To authenticate users by verifying their JWT token and attaching the user information to the request.
//How It Works:
//Check for Token: Looks for a JWT in the request cookies.
//Verify Token: Checks if the token is valid using a secret key.
//Attach User: Finds the user from the database based on the token's payload and attaches the user to the request.
//Proceed: Allows the request to continue to the next middleware or route handler if authentication is successful.



import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from './catchAsyncError.js';



import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";

// export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
//   const { token } = req.cookies;
//   if (!token) {
//     return next(new ErrorHandler("User Not Authorized", 401));
//   }
//   const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

//   req.user = await User.findById(decoded.id);

//   next();
// });


export const isAuthenticated = catchAsyncErrors(async (req, res, next) => {
  const { token } = req.cookies;
  console.log("Token from cookies:", token); // Debug line
  
  if (!token) {
    console.log("No token found in cookies");
    return next(new ErrorHandler("User Not Authorized", 401));
  }
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log("Decoded token:", decoded); // Debug line

    req.user = await User.findById(decoded.id);
    console.log("User found:", req.user?.email); // Debug line
    
    if (!req.user) {
      console.log("User not found in database");
      return next(new ErrorHandler("User Not Found", 401));
    }

    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return next(new ErrorHandler("Invalid Token", 401));
  }
});





