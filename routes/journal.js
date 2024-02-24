import express from "express"; 
import journalController from "../controllers/journal.js";



const router = express.Router();


router.get("/journal", journalController.getJournal);


export default router;
