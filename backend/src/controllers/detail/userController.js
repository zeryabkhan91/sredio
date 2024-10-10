import { fetchGithubUserDetails } from "./userManager.js";
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
