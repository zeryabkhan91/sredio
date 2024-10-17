import axios from "axios";
import { AUTH_CONSTANTS } from "../../constants/authConstant.js";
import Repository from "../../models/repository.js";
import {
  fetchRepoCommits,
  fetchRepoIssues,
  fetchRepoPulls,
} from "../../services/githubService.js";
import User from "../../models/user.js";
import { findRepository } from "../../handlers/RepositoryHandler.js";
import { findUserAndUpdateByUserId } from "../../handlers/UserHandler.js"

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

export const fetchGithubUserAdditionalDetails = async (repoId, accessToken) => {
  try {
    let repo = await findRepository({ id: repoId });

    const totalCommits = await fetchRepoCommits(
      repo.name,
      repo.owner_name,
      accessToken
    );
    const totalPulls = await fetchRepoPulls(
      repo.name,
      repo.owner_name,
      accessToken
    );
    const totalIssues = await fetchRepoIssues(
      repo.name,
      repo.owner_name,
      accessToken
    );

    await findUserAndUpdateByUserId(
      { id: repo.owner_id },
      {
        $set: {
          name: repo.owner_name,
          total_commits: totalCommits,
          total_issues: totalIssues,
          total_pulls: totalPulls,
        },
      },
      { upsert: true, new: true }
    );

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

    await User.deleteOne({ id: repo.owner_id });

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
