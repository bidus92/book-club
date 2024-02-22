import axios from "axios"; 
import express from "express"; 
import bodyParser from "body-parser"; 


import rootDir from "../utils/path.js"; 
import Timer from "../utils/timer.js";
import helper from "../utils/helpers.js"; 


const router = express.Router();

router.use(bodyParser.urlencoded({extended: true, limit: '10mb'})); 

router.get("/", async (req, res) =>
{
    const test = await axios.get(`https://covers.openlibrary.org/b/isbn/9780345296054-M.jpg`);
    const result = await axios.get("https://covers.openlibrary.org/b/isbn/9780307887436-M.jpg");

    res.render("index.ejs", 
    {
        img1: test.config.url,
        img2: result.config.url
    });
});



router.get("/reviews", (req, res) =>
{
    res.render("reviews.ejs", 
    {

    });
});

// TODO: Find check for image existence 
//and if none to skip that imageURL, create loop in EJS for database to loop through authors
//Create loop to limit search results to 10 per page and then create a next page for search results and continue 
//the number

router.post("/database", async (req, res) =>
{
        // const overallTimer = new Timer("Overall Time");

        const rawTitle = req.body.title.toLowerCase(); 

        const title = rawTitle.replaceAll(" ", "+"); 

        const result = await axios.get(`https://openlibrary.org/search.json?title=${title}`);
        
        var searchResults = result.data.docs;

        var theTitles = [];

        var allAuthors = [[]];

            //Gives search results of 10 results per page
        const pageLimit = 10;         
        const numOfPages = Math.ceil(searchResults.length / pageLimit);

        const currentPage = 0;  
        const allCovers = [[]]; 
        for(let x = 0; x < numOfPages - 1; x++)
        {
            allCovers.push([]);
        }

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
                const noneAvailable = ["No Authors Listed"];
                allAuthors.push(noneAvailable);
            }
             
            //loop through isbn numbers to get the promises to push to promises array to get a cover
    }
    
    // array of promises to weed out which ones are good to use and which ones get rejected
    //bool to determine if a book cover was found
    //store chosen book covers
    var chosenBookCovers = [];
    
    for(let x = 0; x < pageLimit; x++)
    {
        var found = false;
        if(searchResults[x].isbn)
        {
            const bookCoverPromises = []; 
            for(let z = 0; z < searchResults[x].isbn.length; z++)
            {
                const bookCoverPromise = helper.checkBookCover(`https://covers.openlibrary.org/b/isbn/${searchResults[x].isbn[z]}-M.jpg?default=false`);
                bookCoverPromises.push(bookCoverPromise);
            }
            const allPotentialCovers = Promise.allSettled(bookCoverPromises); 
            await allPotentialCovers.then(results =>
            {
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
                        break;
                    }
                }
            });
                        //break loop once we've found our image as no need to go through all ISBN numbers
            if(!found)
            {
               chosenBookCovers.push("/assets/images/not_available.jpg"); 
            }
        }
        else
        {
            chosenBookCovers.push("/assets/images/not_available.jpg"); 
        }
     }
    
         allCovers[currentPage] = chosenBookCovers;
        //removes the first empty index from authors array that was used to initialize so array is now populated only with data
        allAuthors.shift();

    //default search position starts at value of 0
    const searchPos = 0; 

        res.render("database.ejs", 
        {
            currentPage: currentPage,
            results: searchResults,
            pageCount: numOfPages,
            pageLimit: pageLimit,
            resultNumber: searchResults.length, 
            titles: theTitles,
            authors: allAuthors, 
            imgURLs: allCovers,
            currentSearchPos: searchPos
        });
});

router.post("/database/page-select", async (req, res) =>
{

    //stringifies array data in the form and parses it here so we can pass the data back to the database page as is
    const resultCount = req.body["resultCount"];
    const results = JSON.parse(req.body["results"]); 
    const titles = JSON.parse(req.body["titles"]);
    const authors =  JSON.parse(req.body["authorNames"]);
    const imgURLs = JSON.parse(req.body["imgURLs"]);
    const pageCount = req.body["pageCount"];
    const currentPage = req.body["page"];

    //takes the value of the page clicked and sets the routerropriate index
    
    const currentSearchPos = (currentPage) * 10; 
    const currentPageLimit = 10; 
    const pageLimit = ((currentSearchPos + 10)); 

    //buffer to hold url links to push to our imgURLs 
    var chosenBookCovers = []; 

    //boolean to indicate whether or not an array of info has already been created
    var alreadySet;

    for(let x = 0, y = currentSearchPos; x < currentPageLimit && y < resultCount; x++, y++)
    {
        //boolean to indicate if an image was found, if not found, replaced with default content not found image
        var found = false;
        if(x === 0 && imgURLs[currentPage].length !== 0)
        {
            alreadySet = true;
            break; 
        }
        if(results[y].isbn)
        {        
            const bookCoverPromises = []; 
            for(let z = 0; z < results[y].isbn.length; z++)
            {
                const bookCoverPromise = helper.checkBookCover(`https://covers.openlibrary.org/b/isbn/${results[y].isbn[z]}-L.jpg?default=false`);
                bookCoverPromises.push(bookCoverPromise);
            }
            const allPotentialCovers = Promise.allSettled(bookCoverPromises); 
            await allPotentialCovers.then(res =>
            {
                for(let w = 0; w < res.length; w++)
                {
                    if(res[w].status === "rejected")
                    {
                        continue;
                    }
                    else
                    {
                        found = true; 
                        chosenBookCovers.push(res[w].value);
                        break;
                    }
                }
            });
                        //break loop once we've found our image as no need to go through all ISBN numbers
            if(!found)
            {
               chosenBookCovers.push("/assets/images/not_available.jpg"); 
            }

        }
        else
        {
            chosenBookCovers.push("/assets/images/not_available.jpg"); 
        }
     }

     if(!alreadySet)
     {
        imgURLs[currentPage] = chosenBookCovers;
     }
     


    res.render("database.ejs" , 
    {
        results: results,
        resultNumber: resultCount, 
        pageCount: pageCount,
        pageLimit: pageLimit,
        titles: titles,
        authors: authors, 
        imgURLs: imgURLs,
        currentSearchPos: currentSearchPos,
        currentPage: currentPage

    });
});


router.get("/database", (req, res) =>
{
    res.render("database.ejs", 
    {
        placeholderMessage: "Enter book title here"
    });
});

router.get("/notes", (req, res) =>
{
    res.render("notes.ejs", 
    {

    });
});

router.get("/portfolio", (req, res) =>
{
    res.redirect("https://bidus92.github.io/JB-Portfolio/");
});

export default router;
