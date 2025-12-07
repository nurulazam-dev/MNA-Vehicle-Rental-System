import express from "express";
import auth from "../../middleware/auth";
import { userController } from "./users.controller";

const router = express.Router();

router.get("/", auth("admin"), userController.getUsers);
router.put("/:userId", auth(), userController.updateUser);
router.delete("/:userId", auth("admin"), userController.deleteUser);

export const userRoutes = router;
