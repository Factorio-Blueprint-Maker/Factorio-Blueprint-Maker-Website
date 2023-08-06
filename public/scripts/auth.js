import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut, sendEmailVerification } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { ref, set, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { app, auth, database, GoogleProvider } from "./AppConfig.js";


// Login
const signinBtn = document.querySelector(".signin-button");

if (signinBtn) {
    signinBtn.addEventListener("click", function() {

        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        signInWithEmailAndPassword(auth, email, password).then((userCredentials) => {

            checkAuthState();

        }).catch((error) => {
            console.log(error.message);
        });
    });    
}

// Signup

const nextStepEmail = document.querySelector(".next-step-email");
const nextStepPassword = document.querySelector(".next-step-password");

const emailpage = document.querySelector(".email-container");
const passwordpage = document.querySelector(".password-container");
const verificationpage = document.querySelector(".verification-container");

if (nextStepEmail) {

    nextStepEmail.addEventListener("click", () => {

        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;

        // check if the input fields are empty
        if (email.trim() === "" || username.trim() === "") {
            console.log("there's empty input fields");
        }
        else {
            emailpage.style.display = "none";
            passwordpage.style.display = "block";

            nextStepPassword.addEventListener("click", () => {
                
                const password = document.getElementById("password").value;
                const confirm_password = document.getElementById("confirm-password").value;

                if (password == confirm_password) {
                    createUserWithEmailAndPassword(auth, email, password)
                    .then((credential) => {

                        passwordpage.style.display = "none";
                        verificationpage.style.display = "block";    

                        console.log(auth.currentUser);
                    }).catch((error) => {
                        console.error(error.message);
                    })
                    } else {
                        console.log("hey");
                }

            })
        }
    })
}

// Signup with Google
const signinWithGoogle = document.querySelector(".signinWithGoogle");

// check if the signin with Google button is available
if(signinWithGoogle) {
    signinWithGoogle.addEventListener("click", async function() {

        // sign in with Google Popup and store the result in the result object
        signInWithPopup(auth, GoogleProvider).then(async (result) => {
            const user = result.user;
            const userReference = ref(database, "/users/" + user.uid);  // sets the database reference for the user
            const userSnapshot = await get(userReference);  // get a snapshot of the user database

            // check if the user already exists before adding it to the database
            if (!userSnapshot.exists()) {
                await set(userReference, {
                    name: user.displayName,
                    email: user.email,
                    createdAt: serverTimestamp()
                });
            }

            checkAuthState();

        }).catch((error) => {
            console.error(error.message);
        });
    });
}

// Logout User
function logoutUser() {
    signOut(auth).then(() => {
        checkAuthState();
        window.location.replace("../auth/signin.html");
    }).catch((error) => {
        console.log(error.message);
    });
}

export { logoutUser };


// check auth state
function checkAuthState() {

    onAuthStateChanged(auth, (user) => {

        const signinLink = document.getElementById("signin-link");
        const profile = document.getElementById("profile");

        if (user) {
            signinLink.style.display = 'none';
            profile.style.display = 'block'; 
        } else {
            signinLink.style.display = 'block';
            profile.style.display = 'none';
        }
    });
}


// Automatically check auth state when the page loads
document.addEventListener('DOMContentLoaded', checkAuthState);