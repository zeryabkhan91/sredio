import axios from "axios";
import { AUTH_CONSTANTS } from "../../constants/authConstant.js";
import Repository from "../../models/repository.js";

const GITHUB_BASE_URL = process.env.GITHUB_BASE_URL; 

export const getAllRepositories = async (page, limit) => {
  try {
    const skip = (page - 1) * limit;
    const repositories = await Repository.find({}).skip(skip).limit(limit);

    const totalRepositories = await Repository.countDocuments();

    return {
      repositories,
      totalRepositories,
      totalPages: Math.ceil(totalRepositories / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error("Error fetching repositories:", error);
    throw new Error(
      AUTH_CONSTANTS.ERROR_MESSAGES.FETCH_ALL_REPOSITORIES_FAILED
    );
  }
};
export const fetchGithubRepositoryDetails = async (
  owner,
  repo,
  accessToken
) => {
  try {
    const response = await axios.get(
      `${GITHUB_BASE_URL}/repos/${owner}/${repo}`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching repository details:", error);
    throw new Error(
      AUTH_CONSTANTS.ERROR_MESSAGES.FETCH_REPOSITORY_DETAILS_FAILED
    );
  }
};
