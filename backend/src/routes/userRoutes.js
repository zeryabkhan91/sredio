import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import { getUserDetails } from "../controllers/detail/userController.js";

const router = express.Router();

router.get("/details", authenticateUser, getUserDetails);

export default router;
