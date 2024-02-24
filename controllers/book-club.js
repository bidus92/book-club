import axios from "axios";
import Helpers from "../models/helpers.js"; 

const helper = new Helpers(); 


export default{
    getIndex: async function getIndex(req, res, next)
    {
        const test = await axios.get(`https://covers.openlibrary.org/b/isbn/9780345296054-M.jpg`);
        const result = await axios.get("https://covers.openlibrary.org/b/isbn/9780307887436-M.jpg");
        
        res.render("index", 
        {
            img1: test.config.url,
            img2: result.config.url
        });
    },


    //TODO: Seperate into own controller as site content grows
    //---------------------------------------------------------------------------------------------
    getReviews: function getReviews(req, res, next)
    {
        res.render("reviews", 
        {

        });
    },
    //---------------------------------------------------------------------------------------------

    getPortfolio: function getPortfolio(req, res, next)
    {
        res.redirect("https://bidus92.github.io/JB-Portfolio/");
    }
}


