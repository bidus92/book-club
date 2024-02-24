const menuButton = document.querySelector(".menu-btn");
const touchMenu = document.querySelector(".mobile-tablet-menu"); 
var clickCount = 0; 
var menuSelect = 0; 


const activePage = document.location.pathname;
console.log(activePage);
const selectedMenuItem = document.querySelectorAll(".nav-item");
switch(activePage)
{
     case "/":
          selectedMenuItem[0].classList.toggle("selected");
          selectedMenuItem[5].classList.toggle("selected");
     break;
     case "/reviews":
          selectedMenuItem[1].classList.toggle("selected");
          selectedMenuItem[6].classList.toggle("selected");
     break;
     case "/database":
          selectedMenuItem[2].classList.toggle("selected");
          selectedMenuItem[7].classList.toggle("selected");
     break;
     case "/journal":
          selectedMenuItem[3].classList.toggle("selected");
          selectedMenuItem[8].classList.toggle("selected");
     break;
}


//event listener for menu scrolling
//TODO: utilize async/await to make this work properly
menuButton.addEventListener("click", ()=>
{
     clickCount++;
     if(clickCount % 2 !== 0)
     {    touchMenu.classList.toggle("hide-display");
          setTimeout(()=>
          {
               menuButton.classList.toggle("menu-icon-animation");
               touchMenu.classList.toggle("show-mobile-menu"); 
               
          }, "200"); 
     }
     else
     { 
          menuButton.classList.toggle("menu-icon-animation");
          touchMenu.classList.toggle("show-mobile-menu"); 

          setTimeout(()=>
          {
               touchMenu.classList.toggle("hide-display");
          }, "200"); 
     }
});
