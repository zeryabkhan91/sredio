import {
  exchangeCodeForToken,
  getUserData,
} from "../../services/githubService.js";
import { generateToken } from "../../utilis/jwtUtils.js";
import { AUTH_CONSTANTS } from "../../constants/authConstant.js";
import {
  deleteIntegrationById,
  saveIntegration,
} from "../../handlers/integrationHandler.js";
import axios from "axios";
import { findRepository, saveRepository } from "../../handlers/RepositoryHandler";
import { findOrganizationByUserId, saveOrganizationDetails } from "../../handlers/OrganizationHandler.js";

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

    await saveIntegration({ userId, accessToken });
    const token = generateToken(userId, accessToken);

    await fetchGithubOrganizationsAndRepositories(accessToken);

    return {
      message: AUTH_CONSTANTS.SUCCESS_MESSAGES.INTEGRATION_SUCCESS,
      token,
    };
  } catch (error) {
    console.error("GitHub authentication error:", error.message);
    throw new Error(
      error.message || AUTH_CONSTANTS.ERROR_MESSAGES.GITHUB_AUTH_FAILED
    );
  }
};

export const disconnectGithubIntegration = async (userId) => {
  try {
    await deleteIntegrationById(userId);

    return { message: AUTH_CONSTANTS.SUCCESS_MESSAGES.DISCONNECT_SUCCESS };
  } catch (error) {
    console.error("Error in service while disconnecting GitHub:", error);
    throw new Error(AUTH_CONSTANTS.ERROR_MESSAGES.DISCONNECT_ERROR);
  }
};

export const fetchGithubOrganizationsAndRepositories = async (accessToken) => {
  try {
    const organizationsResponse = await axios.get(
      `${GITHUB_BASE_URL}/organizations`,
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const organizations = organizationsResponse.data;

    const orgReposPromises = organizations.map(async (org) => {
      if (!org.id) {
        return;
      }
      let existingOrg = await findOrganizationByUserId({ id: org.id });

      if (!existingOrg) {
        existingOrg = saveOrganizationDetails({
          login: org.login,
          id: org.id,
          node_id: org.node_id,
          url: org.url,
          repos_url: org.repos_url,
          events_url: org.events_url,
          hooks_url: org.hooks_url,
          issues_url: org.issues_url,
          members_url: org.members_url,
          public_members_url: org.public_members_url,
          avatar_url: org.avatar_url,
          description: org.description,
        });

        await existingOrg.save();
      }

      const reposResponse = await axios.get(
        `${GITHUB_BASE_URL}/orgs/${org.id}/repos`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const repos = reposResponse.data;

      const repoPromises = repos.map(async (repo) => {
        if (!repo.id) {
          return;
        }

        let existingRepo = await findRepository({ id: repo.id });

        if (!existingRepo) {
          await saveRepository({
            id: repo.id,
            name: repo.name,
            full_name: repo.full_name,
            html_url: repo.html_url,
            description: repo.description,
            private: repo.private,
            fork: repo.fork,
            url: repo.url,
            created_at: repo.created_at,
            updated_at: repo.updated_at,
            pushed_at: repo.pushed_at,
            size: repo.size,
            stargazers_count: repo.stargazers_count,
            watchers_count: repo.watchers_count,
            language: repo.language,
            forks_count: repo.forks_count,
            open_issues_count: repo.open_issues_count,
            watchers: repo.watchers,
            default_branch: repo.default_branch,
            organization_id: existingOrg.id,
            owner_name: repo.owner.login,
            owner_id: repo.owner.id,
          })
        }
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
