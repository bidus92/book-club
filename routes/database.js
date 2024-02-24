import express from "express";
import databaseController from "../controllers/database.js";

const router = express.Router();

router.get("/database", databaseController.getDatabase); 
router.post("/database", databaseController.searchDatabase);
router.post("/database/page-select", databaseController.databasePageSelect);

export default router;