import express from "express"; 
import bodyParser from "body-parser"; 
import axios from "axios"; 
import pg from "pg"; 
import path from "path";
import rootDir from "./utils/path.js"; 
import ejs from "ejs"; 
import fs from "fs";
import bookClubRoutes from "./routes/book-club.js";


const app = express(); 
app.use(express.static(path.join(rootDir, "public")));


app.use(bodyParser.urlencoded({extended: true, limit: '10mb'})); 

const router = express.Router(); 

const port = 3000; 

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database: "book-club",
    password:"",
    port: 5432
});

db.connect(); 

app.use(bookClubRoutes);


app.listen(port, (res, error) =>
{
    try
    {
        console.log(`Now listening at port ${port}`); 
    }
    catch(error)
    {
        console.log(error); 
        res.sendStatus(404); 
    }
})







