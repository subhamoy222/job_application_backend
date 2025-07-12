export const sendToken = (user, statusCode, res, message) => {
  const token = user.getJWTToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_EXPIRE* 24 * 60 * 60 * 1000
    ),
    httpOnly: true, // Set httpOnly to true
    secure: process.env.NODE_ENV === 'production', // Only use secure in production
    sameSite: 'lax', // Allow cross-site requests
  };

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    user,
    message,
    token,
  });
};