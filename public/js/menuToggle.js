const menuButton = document.querySelector(".menu-btn");
const touchMenu = document.querySelector(".mobile-tablet-menu"); 
var clickCount = 0; 

menuButton.addEventListener("click", ()=>
{
     clickCount++;
     if(clickCount % 2 !== 0)
     {    touchMenu.classList.toggle("hide-display");
          setTimeout(()=>
          {
               touchMenu.classList.toggle("show-mobile-menu"); 
               menuButton.classList.toggle("menu-icon-animation");
          }, "200"); 
     }
     else
     {
          touchMenu.classList.toggle("show-mobile-menu"); 
          menuButton.classList.toggle("menu-icon-animation");

          setTimeout(()=>
          {
               touchMenu.classList.toggle("hide-display");
          }, "200"); 
     }


});
