import express from "express"; 
import bodyParser from "body-parser"; 
import axios, { all } from "axios"; 
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

function bookCoverRejected(err)
{
    console.log("There is no book cover here :("); 
    console.log(err);
}
//promsise that url returns if one is found, but if status code 404 is returned it is rejected
async function checkBookCover(bookCoverLink)
{ 
    var bookCover = await axios.get(bookCoverLink);
    return new Promise(function(resolve, reject)
    {
        if(bookCover === 404)
        {
            reject("No book cover exists");
        }
        else
        {
            // console.log(bookCover.config.url);
            resolve(bookCover.config.url); 
        }
    });
}




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

// TODO: Find check for image existence 
//and if none to skip that imageURL, create loop in EJS for database to loop through authors
//Create loop to limit search results to 10 per page and then create a next page for search results and continue 
//the number

app.post("/database", async (req, res) =>
{
    const rawTitle = req.body.title.toLowerCase(); 
    // console.log(rawTitle);
    // console.log(typeof(rawTitle));


    const title = rawTitle.replaceAll(" ", "+"); 


    // console.log(title);
    const result = await axios.get(`https://openlibrary.org/search.json?title=${title}`);
    
    var searchResults = result.data.docs;

    //store chosen book covers
    var chosenBookCovers = [];
    var theTitles = [];

    var allAuthors = [[]];
    //acquire documents
    
    
    //loop through results, take title of each result and push authors into an array to list accordingly
   for(let x = 0; x < searchResults.length; x++)
    {
        theTitles.push(searchResults[x].title); 
        var theAuthors = []; 
        //loop through authors to push to array to ultimately display
        if(searchResults[x].author_name)
        {
            for(let y = 0; y < searchResults[x].author_name.length; y++)
            {
                theAuthors.push(searchResults[x].author_name[y]);
            }

            allAuthors.push(theAuthors); 
        }
        else
        {
            theAuthors.push(["N/A"]);
        }
        
        // array of promises to weed out which ones are good to use and which ones get rejected
        const bookCoverPromises = []; 
        //bool to determine if a book cover was found
        var found = false; 
        //loop through isbn numbers to get the promises to push to promises array to get a cover
        if(searchResults[x].isbn)
        {
            for(let z = 0; z < searchResults[x].isbn.length; z++)
            {
                const bookCoverPromise = checkBookCover(`https://covers.openlibrary.org/b/isbn/${searchResults[x].isbn[z]}-M.jpg?default=false`);
                bookCoverPromises.push(bookCoverPromise);
            }
        
            const allPotentialCovers = Promise.allSettled(bookCoverPromises); 
          
            await allPotentialCovers.then(results =>
                {
                   
                    // console.log(results);
                    for(let w = 0; w < results.length; w++)
                    {
                        if(results[w].status === "rejected")
                        {
                            continue;
                        }
                        else
                        {
                            found = true; 
                            chosenBookCovers.push(results[w].value);
                            console.log("The chosen book cover is " + chosenBookCovers[w]);
                            break;
                        }
                    }
                });
        }
        if(!found)
        {
            chosenBookCovers.push("assets/images/not_available.jpg");
        }
    }

   console.log(chosenBookCovers.length);
   console.log(allAuthors);

    res.render("database.ejs", 
    {
        resultNumber: searchResults.length, 
        titles: theTitles,
        authors: allAuthors, 
        imgURLs: chosenBookCovers
    });
});




app.get("/database", (req, res) =>
{
    res.render("database.ejs", 
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







