import express from "express";
import { getThumbnailByID, getUserThumbnails,  } from "../controllers/userController.js";
import protect from "../middlewares/auth.js";

const UserRouter = express.Router();

UserRouter.get("/", protect, getUserThumbnails);
UserRouter.get("/thumbnail/:id", protect, getThumbnailByID);

export default UserRouter;