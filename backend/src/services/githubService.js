import axios from "axios";
import { AUTH_CONSTANTS } from "../constants/authConstant.js";

const GITHUB_API_URL = "https://github.com/login/oauth/access_token";
const GITHUB_USER_URL = "https://api.github.com/user";

export const exchangeCodeForToken = async (clientId, clientSecret, code) => {
  const response = await axios.post(
    GITHUB_API_URL,
    { client_id: clientId, client_secret: clientSecret, code },
    { headers: { Accept: "application/json" } }
  );
  const result = response.data;

  if (result?.error) {
    throw new Error(result?.error_description);
  }

  return result.access_token;
};

export const getUserData = async (accessToken) => {
  const response = await axios.get(GITHUB_USER_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  return response.data;
};

export const fetchGithubUserDetails = async (userId, accessToken) => {
  try {
    const userResponse = await axios.get(GITHUB_USER_URL, {
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
