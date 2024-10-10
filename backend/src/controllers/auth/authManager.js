import {
  exchangeCodeForToken,
  getUserData,
} from "../../services/githubService.js";
import { generateToken } from "../../utilis/jwtUtils.js";
import { AUTH_CONSTANTS } from "../../constants/authConstant.js";
import { deleteIntegrationById, saveIntegration } from "../../handlers/integrationHandler.js";

export const handleGithubAuth = async (code) => {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.MISSING_CLIENT_ID_OR_SECRET);
  }

  try {
    const accessToken = await exchangeCodeForToken(
      clientId,
      clientSecret,
      code
    );

    const userData = await getUserData(accessToken);
    const userId = userData.id;

    await saveIntegration({ userId, accessToken });
    const token = generateToken(userId, accessToken);

    return {
      message: AUTH_CONSTANTS.SUCCESS_MESSAGES.INTEGRATION_SUCCESS,
      token,
    };
  } catch (error) {
    console.error("GitHub authentication error:", error.message);
    throw new Error(error.message || AUTH_CONSTANTS.ERROR_MESSAGES.GITHUB_AUTH_FAILED);
  }
};

export const disconnectGithubIntegration = async (userId) => {
  try {
    deleteIntegrationById(userId);

    return { message: AUTH_CONSTANTS.SUCCESS_MESSAGES.DISCONNECT_SUCCESS };
  } catch (error) {
    console.error("Error in service while disconnecting GitHub:", error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.DISCONNECT_ERROR);
  }
};
