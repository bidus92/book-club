import axios from "axios";

export default {
    bookCoverRejected: function bookCoverRejected(err)
    {
        console.log("There is no book cover here :("); 
        console.log(err);
    }, 
    //Promsise function that returns book cover url if one is found, but if status code 404 when it is blank, it is rejected
    checkBookCover:
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
};