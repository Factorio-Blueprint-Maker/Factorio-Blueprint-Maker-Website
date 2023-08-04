import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
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

const signupBtn = document.querySelector(".signup-button");

if (signupBtn) {
    signupBtn.addEventListener("click", async function() {
        try {
            const name = document.getElementById("name").value;
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;

            // Perform your user creation logic here
            const userCredentials = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredentials.user;
            const userReference = ref(database, "/users/" + user.uid);
            
            await set(userReference, {
                name: name,
                email: user.email,
                createdAt: serverTimestamp()
            });
            
            checkAuthState();

        } catch (error) {
            console.error("Error creating user or importing data to database: " + error);
        }
    });
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
    }).catch((error) => {
        console.log(error.message);
    });
}

export { logoutUser };


// check auth state
function checkAuthState() {

    onAuthStateChanged(auth, (user) => {

        const signinLink = document.getElementById("signin-link");
        const signupLink = document.getElementById("signup-link");
        const logoutLink = document.getElementById("logout-link");

        if (user) {
            signinLink.style.display = 'none';
            signupLink.style.display = 'none';
            logoutLink.style.display = 'block'; 
        } else {
            signinLink.style.display = 'block';
            signupLink.style.display = 'block';
            logoutLink.style.display = 'none';
        }
    });
}


// Automatically check auth state when the page loads
document.addEventListener('DOMContentLoaded', checkAuthState);