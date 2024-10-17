import {
  deleteUser,
  fetchGithubUserAdditionalDetails,
  fetchGithubUserDetails,
  getUsers,
} from "./userManager.js";
import { findIntegrationByUserId } from "../../handlers/integrationHandler.js";

export const getUserDetails = async (req, res) => {
  const { userId, accessToken } = req.tokenData;

  try {
    const [integration, user] = await Promise.all([
      findIntegrationByUserId(userId),
      fetchGithubUserDetails(userId, accessToken),
    ]);

    res.json({ user: { ...user, ...integration.toJSON() } });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message }); // error code ?
  }
};

export const getUserAdditionalDetails = async (req, res) => {
  const { accessToken } = req.tokenData;
  const { repoId } = req.params;

  try {
    const data = await fetchGithubUserAdditionalDetails(repoId, accessToken);
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

export const deleteIncludedUser = async (req, res) => {
  const { accessToken } = req.tokenData;
  const { repoId } = req.params;

  try {
    const data = await deleteUser(repoId, accessToken);
    res.json({ data });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};

export const getUsersList = async (req, res) => {
  try {
    const { page, limit } = req.query;
    const users = await getUsers(page, limit);
    res.json({ data: users });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: error.message });
  }
};
