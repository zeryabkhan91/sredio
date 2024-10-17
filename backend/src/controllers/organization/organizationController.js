import {
  fetchGithubRepositoryDetails,
  getAllRepositories,
} from "./organizationManager.js";

export const getRepositories = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const repositories = await getAllRepositories(page, limit);
    res.json({ data: repositories });
  } catch (error) {
    console.error("Error fetching repositories:", error);

    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "An unexpected error occurred";

    res.status(statusCode).json({ error: errorMessage });
  }
};

export const getRepositoryDetails = async (req, res) => {
  const { accessToken } = req.tokenData;
  const { owner, repo } = req.params;

  try {
    const repositoryDetails = await fetchGithubRepositoryDetails(
      owner,
      repo,
      accessToken
    );
    res.json({ data: repositoryDetails });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    const errorMessage = error.message || "An unexpected error occurred";

    res.status(statusCode).json({ error: errorMessage });
  }
};
