import { signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { ref, set } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { app, auth, database } from "./AppConfig.js";


// Login

const signinBtn = document.querySelector(".signin-button");

if (signinBtn) {
    signinBtn.addEventListener("click", function() {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {
            console.log("user created successfully");
        }).catch((error) => {
            console.log(error.message);
        });
    });    
}

// Signup

const signupBtn = document.querySelector(".signup-button");

if (signupBtn) {
    signupBtn.addEventListener("click", function() {
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        createUserWithEmailAndPassword(auth, email, password).then((userCredentials) => {
            
            const user = userCredentials.user;

            const userReference = ref(database, "/users/" + user.uid);
            set(userReference, {
                name: name,
                email: user.email
            }).then(() => {
              console.log("User was created successfully");  
            }).catch((error) => {
              console.error("Error importing data to databsase: " + error);
            })

        }).catch((error) => {
            console.error(error.message);
        });
    });
}

