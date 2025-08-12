import express from "express";
import { verifyToken } from "../middleware/auth.js";
import {
  register,
  login,
  getUsers,
  getUser,
  getProfile,
  updateUserById,
  updateProfile,
  changeUserPassword,
  deleteUserById,
  deleteProfile,
  createUserByAdmin,
} from "./users.controller.js";

const router = express.Router();

// Public routes (no authentication required)
router.post("/register", register);
router.post("/login", login);

// Protected routes (authentication required)
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.put("/profile/password", changeUserPassword);
router.delete("/profile", deleteProfile);

// Admin routes (for managing users) - Temporarily removed auth for testing
router.get("/", getUsers);
router.post("/", createUserByAdmin);
router.get("/:userId", getUser);
router.put("/:userId", updateUserById);
router.delete("/:userId", deleteUserById);

// Temporary test route (remove in production)
router.get("/test/public", (req, res) => {
  res.json({
    success: true,
    message: "Public users endpoint is working",
    data: {
      users: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    },
  });
});

export default router;
