import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup  } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";
import { ref, set, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { app, auth, database, GoogleProvider } from "./AppConfig.js";


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
            
            console.log("User was created successfully");
        } catch (error) {
            console.error("Error creating user or importing data to database: " + error);
        }
    });
}

// Signup with Google
const signinWithGoogle = document.querySelector(".signinWithGoogle");

if(signinWithGoogle) {
    signinWithGoogle.addEventListener("click", async function() {
        signInWithPopup(auth, GoogleProvider).then(async (result) => {
            const user = result.user;
            const userReference = ref(database, "/users/" + user.uid);
            
            const userSnapshot = await get(userReference);
            if (!userSnapshot.exists()) {
                await set(userReference, {
                    name: user.displayName,
                    email: user.email,
                    createdAt: serverTimestamp()
                });
            }
        });
    });
}