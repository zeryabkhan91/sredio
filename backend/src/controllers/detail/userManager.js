import axios from "axios";
import { AUTH_CONSTANTS } from "../../constants/authConstant.js";
import {
  fetchRepoCommits,
  fetchRepoIssues,
  fetchRepoPulls,
} from "../../services/githubService.js";
import User from "../../models/user.js";
import { findRepository, updateRepository } from "../../handlers/RepositoryHandler.js";
import { deleteUsersByOptions, saveUserDetails } from "../../handlers/UserHandler.js"
import { v4 as uuid } from 'uuid'
import { mergeCommitsAndPullsCount } from "../../utilis/github-utils.js";

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
    console.error("Error fetching GitHub user details:", error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.FETCH_USER_DETAILS_FAILED);
  }
};

export const fetchGithubUserAdditionalDetails = async (repoId, accessToken, isIncluded) => {
  try {
    const repo = await updateRepository(repoId, { isIncluded });

    if (!isIncluded) {
      await deleteUsersByOptions({ repoId: repo.id })

      return
    }

    const commits = await fetchRepoCommits(
      repo.name,
      repo.owner.login,
      accessToken
    );
    const pulls = await fetchRepoPulls(
      repo.name,
      repo.owner.login,
      accessToken
    );
    const issues = await fetchRepoIssues(
      repo.name,
      repo.owner.login,
      accessToken
    );

    const unifiedUsers = mergeCommitsAndPullsCount(commits, pulls, issues);

    for (const user of unifiedUsers) {
      await saveUserDetails({
        id: uuid(),
        integrationId: repo.integrationId,
        repoId: repo.id,
        name: user.name,
        total_commits: user.commits,
        total_issues: user.issues,
        total_pulls: user.pulls,
      });  
    }

    const allUsers = await User.find();

    return allUsers;
  } catch (error) {
    console.error("Error fetching GitHub user additional details:", error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.FETCH_USER_DETAILS_FAILED);
  }
};

export const deleteUser = async (repoId) => {
  try {
    const repo = await findRepository({ id: repoId });

    await deleteUsersByOptions({ id: repo.owner.id });

    const allUsers = await User.find();
    return allUsers;
  } catch (error) {
    console.error("Error fetching GitHub user details:", error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.EXCLUDE_USER_FAILED);
  }
};

export const getUsers = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const users = await User.find({}).skip(skip).limit(limit);

    const totalUsers = await User.countDocuments();

    return {
      users,
      totalUsers,
      totalPages: Math.ceil(totalUsers / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.FETCH_ALL_USERS_FAILED);
  }
};
