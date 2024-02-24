import axios from "axios";

class Helpers
{
    constructor()
    {
        Helpers.prototype.bookCoverRejected = function (err)
        {
            console.log("There is no book cover here :("); 
            console.log(err);
        };
        Helpers.prototype.checkBookCover = async function (bookCoverLink)
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
        };
    };
}

export default Helpers;