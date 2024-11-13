import axios from "axios";
import { AUTH_CONSTANTS } from "../constants/authConstant.js";
import { separateUserFromCommitsAndPulls } from "../utilis/github-utils.js";
const GITHUB_BASE_URL = process.env.GITHUB_BASE_URL;
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
    console.error("Error fetching GitHub user details:", error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.VERIFICATION_FAIL);
  }
};

export const fetchUserRepos = async ({ username, accessToken }) => {
  try {
    const userReposResponse = await axios.get(
      `${GITHUB_BASE_URL}/users/${username}/repos`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return userReposResponse.data || [];
  } catch(error) {
    console.log('error', error)
    return [];
  }
}

export const fetchOrganizations = async (accessToken) => {
  try {
    const organizationsResponse = await axios.get(
      `${GITHUB_BASE_URL}/user/orgs`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    return organizationsResponse.data || [];
  } catch(error) {
    return [];
  }
}

export const fetchOrganizationsRepos = async (accessToken) => {
  try {
    const organizationsResponse = await axios.get(
      `${GITHUB_BASE_URL}/user/orgs`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    
    return organizationsResponse.data || [];
  } catch(error) {
    return [];
  }
}

export const fetchRepoCommits = async (repo, owner, accessToken) => {
  try {
    const commitsResponse = await axios.get(
      `${GITHUB_BASE_URL}/repos/${owner}/${repo}/commits`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return separateUserFromCommitsAndPulls(commitsResponse.data);
  } catch (error) {
    console.error(`Error fetching commits for ${repo}:`, error.message);
    return 0;
  }
};

export const fetchRepoPulls = async (repo, owner, accessToken) => {
  try {
    const pullsResponse = await axios.get(
      `${GITHUB_BASE_URL}/repos/${owner}/${repo}/pulls`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return separateUserFromCommitsAndPulls(pullsResponse.data);
  } catch (error) {
    console.error(`Error fetching pulls for ${repo}:`, error.message);
    return 0;
  }
};

export const fetchRepoIssues = async (repo, owner, accessToken) => {
  try {
    const issuesResponse = await axios.get(
      `${GITHUB_BASE_URL}/repos/${owner}/${repo}/issues`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    return separateUserFromCommitsAndPulls(issuesResponse.data);
  } catch (error) {
    console.error(`Error fetching issues for ${repo}:`, error.message);
    return 0;
  }
};
