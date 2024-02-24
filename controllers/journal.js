import axios from "axios";
import Helpers from "../models/helpers.js"; 

const helper = new Helpers(); 

export default 
{
    getJournal: function getJournal(req, res, next)
    {
        res.render("journal", 
        {

        });
    }
}