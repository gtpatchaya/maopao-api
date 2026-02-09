const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_ACCESS_SECRET || 'your-access-token-secret'; // Fallback for dev, but strongly valid .env usage
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || 'your-refresh-token-secret';

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_SECRET, { expiresIn: '15m' }); // Short-lived access token
  const refreshToken = jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Longer-lived refresh token

  return { accessToken, refreshToken };
};

const cookieOptions = {
  httpOnly: true, // Prevent client-side JS from accessing the cookie
  secure: process.env.NODE_ENV === 'production', // Use secure cookies in production (HTTPS)
  sameSite: 'strict', // CSRF protection
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
};

module.exports = {
  generateTokens,
  cookieOptions,
};
