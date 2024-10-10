import jwt from "jsonwebtoken";

const secret = process.env.JWT_SECRET_KEY;
const expiryTime = process.env.JWT_EXPIRY_TIME;

export const generateToken = (userId, accessToken) => {
  return jwt.sign({ userId, accessToken }, secret, { expiresIn: expiryTime });
};

export const verifyToken = (token) => {
  return jwt.verify(token, secret);
};
