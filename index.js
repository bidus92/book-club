import express from "express"; 
import bodyParser from "body-parser"; 
import axios from "axios"; 
import pg from "pg"; 
import ejs from "ejs"; 


const app = express(); 
app.use(express.static("public")); 

app.use(bodyParser.urlencoded({extended: true})); 

const port = 3000; 

const db = new pg.Client({
    user:"postgres",
    host:"localhost",
    database: "book-club",
    password:"",
    port: 5432
});


db.connect(); 

app.get("/", (req, res) =>
{
    res.render("index.ejs", 
    {

    });
})


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







