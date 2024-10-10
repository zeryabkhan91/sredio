import { handleGithubAuth } from "./authManager.js";
import { AUTH_CONSTANTS } from "../../constants/authConstant.js";
import { disconnectGithubIntegration } from "./authManager.js";

export const authenticateWithGithub = async (req, res) => {
  const { code } = req.body;

  try {
    const result = await handleGithubAuth(code);
    return res.json(result);
  } catch (error) {
    console.error('Error during GitHub authentication:', error);
    res
      .status(500)
      .json({ error: AUTH_CONSTANTS.ERROR_MESSAGES.GITHUB_AUTH_FAILED });
  }
};

export const disconnectFromGithub = async (req, res) => {
  const { userId } = req.tokenData;

  try {
    const result = await disconnectGithubIntegration(userId);

    res.status(200).json(result);
  } catch (error) {
    console.error("Error disconnecting from GitHub:", error);
    res.status(500).json({ error: error.message });
  }
};
