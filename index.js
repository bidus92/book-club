import express from "express"; 
import bodyParser from "body-parser"; 
import pg from "pg"; 
import path from "path";
import rootDir from "./util/path.js"; 
import ejs from "ejs"; 

import errorHandler from "./controllers/page-not-found.js";
import bookClubRoutes from "./routes/book-club.js";
import databaseRoutes from "./routes/database.js";
import journalRoutes from "./routes/journal.js";

//intitiation of express instance
const app = express(); 

//configuration of website settings
app.set("view engine", "ejs");
app.use(express.static(path.join(rootDir, "public")));
app.use(bodyParser.urlencoded({extended: true, limit: '10mb'})); 
const port = 3000; 

//TODO: Abstract out of this page 
//--------------------------------------
const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database: "book-club",
    password:"",
    port: 5432
});

db.connect(); 
//--------------------------------------

app.use(bookClubRoutes);
app.use(databaseRoutes);
app.use(journalRoutes);

app.use(errorHandler.pageNotFound); 

app.listen(port, (res) =>
{
    console.log(`Now listening at port ${port}`); 
});







