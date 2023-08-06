import { logoutUser } from "./auth.js";


// Function to fetch the header content and display it
function fetchAndDisplayHeader() {
    const headerContainer = document.getElementById('header-container');
    const headerFileUrl = '../header.html';
  
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

        const logoutBtn = document.getElementById("logout-button");
        logoutBtn.addEventListener("click", function() {
            console.log("test");
            logoutUser();
        });

        // JavaScript code to handle the dropdown
        const profileBtn = document.getElementById("profile");
        const profileDropdown = document.querySelector(".profile-dropdown");

        let hoveringProfile = false;
        let hoveringDropdown = false;

        // Show the dropdown when hovering over the profile button
        profileBtn.addEventListener("mouseenter", function() {
            hoveringProfile = true;
            profileDropdown.style.display = "flex";
        });

        // Hide the dropdown when the pointer leaves the profile button
        profileBtn.addEventListener("mouseleave", function(event) {
            const toElement = event.toElement || event.relatedTarget;
            if (!profileDropdown.contains(toElement) && !hoveringDropdown) {
                profileDropdown.style.display = "none";
            }
            hoveringProfile = false;
        });

        // Keep the dropdown visible if hovering over the dropdown content
        profileDropdown.addEventListener("mouseenter", function() {
            hoveringDropdown = true;
        });

        profileDropdown.addEventListener("mouseleave", function() {
            hoveringDropdown = false;
            setTimeout(hideDropdown, 200); // Delay hiding to handle small gaps between the button and dropdown
        });

        // Function to hide the dropdown
        function hideDropdown() {
            if (!hoveringProfile) {
                profileDropdown.style.display = "none";
            }
}



      })
      .catch((error) => {
        console.error('Error fetching the header:', error);
      });
  }



// Automatically fetch and display the header when the page loads
document.addEventListener('DOMContentLoaded', fetchAndDisplayHeader);


