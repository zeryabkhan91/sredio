import express from "express";
import { authenticateUser } from "../middleware/authMiddleware.js";
import {
  deleteIncludedUser,
  getUserAdditionalDetails,
  getUserDetails,
  getUsersList,
} from "../controllers/detail/userController.js";

const router = express.Router();

router.get("/details", authenticateUser, getUserDetails);
router.post("/include/:repoId", authenticateUser, getUserAdditionalDetails);
router.delete("/:repoId", authenticateUser, deleteIncludedUser);
router.get("/list", authenticateUser, getUsersList);

export default router;
