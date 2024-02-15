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


app.get("/", async (req, res) =>
{
    const test = await axios.get(`https://covers.openlibrary.org/b/isbn/9780345296054-L.jpg`);
    const result = await axios.get("https://covers.openlibrary.org/b/isbn/9780307887436-L.jpg");

    res.render("index.ejs", 
    {
        img1: test.config.url,
        img2: result.config.url
    });
});



app.get("/reviews", (req, res) =>
{
    res.render("reviews.ejs", 
    {

    });
});

app.get("/database", (req, res) =>
{
    res.render("search.ejs", 
    {

    });
});

app.get("/notes", (req, res) =>
{
    res.render("notes.ejs", 
    {

    });
});

app.get("/portfolio", (req, res) =>
{
    res.redirect("https://bidus92.github.io/JB-Portfolio/");
});


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







