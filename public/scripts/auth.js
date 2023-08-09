import {  signInWithEmailAndPassword, 
          createUserWithEmailAndPassword, 
          signInWithPopup, 
          onAuthStateChanged, 
          signOut, 
          sendEmailVerification, 
          sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import { ref, set, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { app, auth, database, GoogleProvider } from "./AppConfig.js";


// Assuming you have initialized Firebase and have access to the 'auth' object

// Function to update the UI based on the user's authentication state
function updateUI(user) {
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
        signinLink.style.display = "block";
        profile.style.display = "none";
      }
    }
  }


auth.onAuthStateChanged(function(user) {
  updateUI(user);
});

function checkAuthState() {
  updateUI(auth.currentUser);
}


const signupBtn = document.querySelector(".signup-button");

if (signupBtn) {
  signupBtn.addEventListener("click", () => {

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signupUser(email, password)
  })
}


// checks every 3000 milliseconds if the email has been verified
async function waitForEmailVerification(user) {
    if (!user.emailVerified) {
      console.log("please verify your account")
    }
    while (!user.emailVerified) {
      await user.reload();
      await new Promise((resolve) => setTimeout(resolve, 3000)); 
    }
    updateUI()
}

// signs up the user and sends an email verification, if the email gets verified the user gets logged in
async function signupUser(email, password) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;
  
      // adding user to the realtime database
      await addUserToDatabase(credential)

      // Sending email verification for the newly created user.
      await sendEmailVerification(user);
    
      // Wait until the email is verified
      await waitForEmailVerification(user)

    } catch (error) {
      console.error(error.message)
    }
  }


// Signup with Google
const signinWithGoogleBtn = document.querySelector(".signinWithGoogle")

if(signinWithGoogleBtn) {
  signinWithGoogleBtn.addEventListener("click", signinWithGoogle)
}

async function signinWithGoogle() {
  try {
    const credential = await signInWithPopup(auth, GoogleProvider)
    const user = credential.user

    await addUserToDatabase(credential)
    
  } catch (error) {
    console.log(error.message)
  }
}


// Login
const signinBtn = document.querySelector(".signin-button");

if (signinBtn) {
    signinBtn.addEventListener("click", () => {

      const email = document.getElementById("email").value;
      const password = document.getElementById("password").value;

      signinUser(email, password)
    })
}


async function signinUser(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password)
    const user = credential.user

    await waitForEmailVerification(user)
    
  } catch (error) {
    console.error(error);
  }
}


// Reset Password
const resetPasswordBtn = document.querySelector(".reset-password-button")

if(resetPasswordBtn) {
  resetPasswordBtn.addEventListener("click", () => {
    const email = document.getElementById("email").value;
    resetPassword(email);
  })
}

async function resetPassword(email) {
  try {
    await sendPasswordResetEmail(auth, email)
    console.log("Password reset email sent")
  } catch (error) {
    console.log(error.message)
  }
}


// Logout user
async function logoutUser() {
  try {
    await signOut(auth)

    window.location.replace("../auth/signin.html");

  } catch (error) {
    console.log(error.message)
  }
}

export { logoutUser, checkAuthState };


// this function adds the user credentials to the realtime database
async function addUserToDatabase(credentials) {

  const userDbReference = ref(database, "users/" + userId)
  const user = credentials.user;

  try {
    await set(userDbReference, {
      email:  user.email,
      displayName:  user.displayName,
      createdAt: serverTimestamp()
    })
  } catch(error) {
    console.error(error.message);
  }
}