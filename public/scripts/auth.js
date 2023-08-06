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


document.addEventListener('DOMContentLoaded', () => {
    checkAuthState(); 
});
  
  async function checkAuthState() {
    await onAuthStateChanged(auth, (user) => {
      const signinLink = document.getElementById("signin-link");
      const profile = document.getElementById("profile");
  
      if (!user) {
        signinLink.style.display = "block";
        profile.style.display = "none";
      } else {
        if (user.emailVerified) {
          signinLink.style.display = "none";
          profile.style.display = "block";
        } else {
          // User is signed in but not verified
          // You can handle this case accordingly, for example, by showing a message
          signinLink.style.display = "block";
          profile.style.display = "none";
        }
      }
    });
  }
















const signupBtn = document.querySelector(".signup-button");

if (signupBtn) {
  signupBtn.addEventListener("click", () => {
    signupUser();
  });
}

async function waitForEmailVerification(user) {
    while (!user.emailVerified) {
      await user.reload();
      await new Promise((resolve) => setTimeout(resolve, 5000)); 
    }
}
  
async function signupUser() {
    try {
      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;
  
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
  
      // Sending email verification for the newly created user.
      await sendEmailVerification(user);
  
      console.log("Email verification sent successfully!");
  
      // Wait until the email is verified
      await waitForEmailVerification(user);
  
      await checkAuthState();

      console.log("Successfull Signup!!");

    } catch (error) {
      console.error(error.message);
    }
  }