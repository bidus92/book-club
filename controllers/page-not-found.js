
export default
{
    pageNotFound: function pageNotFound(req, res, next)
    {
         res.status(404).render("404", 
         {

         });
    }
};