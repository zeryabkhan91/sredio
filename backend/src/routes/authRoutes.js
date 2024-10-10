import express from "express";
import {
  authenticateWithGithub,
  disconnectFromGithub,
} from "../controllers/auth/authController.js";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getUserDetails } from "../controllers/detail/userController.js";

const router = express.Router();

router.post("/github", authenticateWithGithub);
router.post("/github/disconnect", authenticateUser, disconnectFromGithub);
router.get("/details", authenticateUser, getUserDetails);

export default router;
