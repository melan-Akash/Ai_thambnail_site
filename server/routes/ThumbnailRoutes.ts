import express from "express";
import {
    generateThumbnail,
    deleteThumbnail,
    getMyThumbnails,
} from "../controllers/ThumbnailController.js";
import protect from "../middlewares/auth.js";

const ThumbnailRouter = express.Router();

ThumbnailRouter.get("/my-thumbnails", protect, getMyThumbnails);
ThumbnailRouter.post("/generate", protect, generateThumbnail);
ThumbnailRouter.delete("/:id", protect, deleteThumbnail);

export default ThumbnailRouter;
