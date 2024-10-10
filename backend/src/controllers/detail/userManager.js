import axios from "axios";
import { AUTH_CONSTANTS } from "../../constants/authConstant.js";

const GITHUB_USER_URL = "https://api.github.com/user";

export const fetchGithubUserDetails = async (userId, accessToken) => {
  try {
    const userResponse = await axios.get(GITHUB_USER_URL, {
      // move api call to service
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (userResponse.data.id !== userId) {
      throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.UNAUTHORIZED_USER);
    }

    return userResponse.data;
  } catch (error) {
    //console.error('Error fetching GitHub user details:', error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.VERIFICATION_FAIL);
  }
};
