import { logoutUser } from "./auth.js";


// Function to fetch the header content and display it
function fetchAndDisplayHeader() {
    const headerContainer = document.getElementById('header-container');
    const headerFileUrl = 'header.html';
  
    fetch(headerFileUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((headerContent) => {
        headerContainer.innerHTML = headerContent;
        
        // load the menu hamburger when the header is loaded
        const menuHamburger = document.querySelector(".menu-hamburger")
        const navLinks = document.querySelector(".navbar-links")

        menuHamburger.addEventListener('click',()=>{
            navLinks.classList.toggle('mobile-menu')
        })

        const logoutBtn = document.getElementById("logout-link");
        logoutBtn.addEventListener("click", function() {
          logoutUser();
        });
      })
      .catch((error) => {
        console.error('Error fetching the header:', error);
      });
  }



// Automatically fetch and display the header when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayHeader);


