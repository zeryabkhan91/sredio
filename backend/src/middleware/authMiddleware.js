import { verifyToken } from "../utilis/jwtUtils.js";
import { AUTH_CONSTANTS } from "../constants/authConstant.js";

export const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: AUTH_CONSTANTS.ERROR_MESSAGES.TOKEN_REQUIRED });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = verifyToken(token);
    req.tokenData = decoded;
    next();
  } catch (error) {
    // console.error('Token validation error:', error);
    return res
      .status(401)
      .json({ error: AUTH_CONSTANTS.ERROR_MESSAGES.TOKEN_VALIDATION_FAILED });
  }
};
