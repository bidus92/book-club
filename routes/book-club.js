import express from "express"; 
import bookClubController from "../controllers/book-club.js";


const router = express.Router();


router.get("/", bookClubController.getIndex); 

router.get("/reviews", bookClubController.getReviews);

router.get("/portfolio", bookClubController.getPortfolio); 


export default router;
