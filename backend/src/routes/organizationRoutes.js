import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  getRepositories,
  getRepositoryDetails,
} from "../controllers/organization/organizationController.js";

const router = express.Router();

router.get("/repos", authenticateUser, getRepositories);
router.get("/repos/:owner/:repo", authenticateUser, getRepositoryDetails);

export default router;
