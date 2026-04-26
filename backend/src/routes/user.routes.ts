import { Router } from "express";
import { getUserById, updateMyProfile } from "../controllers/user.controller.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

router.put("/me", authRequired, updateMyProfile);
router.get("/:id", getUserById);

export default router;
