import {
  exchangeCodeForToken,
  fetchOrganizationsRepos,
  fetchUserRepos,
  getUserData,
} from "../../services/githubService.js";
import { generateToken } from "../../utilis/jwtUtils.js";
import { AUTH_CONSTANTS } from "../../constants/authConstant.js";
import {
  deleteIntegrationById,
  findIntegrationByUserId,
  saveIntegration,
} from "../../handlers/integrationHandler.js";
import axios from "axios";
import {
  deleteOrganization,
  saveOrganizationDetails,
} from "../../handlers/OrganizationHandler.js";
import {
  deleteRepositoryByIntegration,
  saveRepository,
} from "../../handlers/RepositoryHandler.js";
import { deleteUsersByOptions } from "../../handlers/UserHandler.js";

const GITHUB_BASE_URL = process.env.GITHUB_BASE_URL;

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

    const integration = await saveIntegration({ userId, accessToken });
    const token = generateToken(userId, accessToken);

    await fetchGithubOrganizationsAndRepositories(
      userData.login,
      accessToken,
      integration._id?.toJSON()
    );

    return {
      message: AUTH_CONSTANTS.SUCCESS_MESSAGES.INTEGRATION_SUCCESS,
      token,
    };
  } catch (error) {
    console.error("GitHub authentication error:", error);
    throw new Error(
      error.message || AUTH_CONSTANTS.ERROR_MESSAGES.GITHUB_AUTH_FAILED
    );
  }
};

export const disconnectGithubIntegration = async (userId) => {
  try {
    const integration = await findIntegrationByUserId(userId);

    await deleteIntegrationById(userId);
    await deleteUsersByOptions({ integrationId: integration?._id?.toJSON() });
    await deleteRepositoryByIntegration(integration?._id?.toJSON());
    await deleteOrganization(integration?._id?.toJSON());

    return { message: AUTH_CONSTANTS.SUCCESS_MESSAGES.DISCONNECT_SUCCESS };
  } catch (error) {
    console.error("Error in service while disconnecting GitHub:", error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.DISCONNECT_ERROR);
  }
};

export const fetchGithubOrganizationsAndRepositories = async (
  username,
  accessToken,
  integrationId
) => {
  try {
    const userRepos = await fetchUserRepos({ username, accessToken });

    await Promise.all(
      userRepos.map(async (repo) => {
        await saveRepository({ ...repo, integrationId });
      })
    );

    const organizations = await fetchOrganizationsRepos(accessToken);

    const orgReposPromises = organizations.map(async (org) => {
      if (!org.id) {
        return;
      }

      await saveOrganizationDetails({ ...org, integrationId });

      const reposResponse = await axios.get(
        `${GITHUB_BASE_URL}/orgs/${org.login}/repos`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const repos = reposResponse.data;

      const repoPromises = repos.map(async (repo) => {
        if (!repo.id) {
          return;
        }

        await saveRepository({ ...repo, integrationId });
      });

      await Promise.all(repoPromises);

      return { org, repos };
    });

    const orgRepos = await Promise.all(orgReposPromises);

    return orgRepos;
  } catch (error) {
    console.error(
      "Error fetching and saving GitHub organizations and repositories:",
      error
    );
    throw new Error(
      AUTH_CONSTANTS.ERROR_MESSAGES.FETCH_ORGANIZATIONS_AND_REPOSITORIES_FAILED
    );
  }
};
