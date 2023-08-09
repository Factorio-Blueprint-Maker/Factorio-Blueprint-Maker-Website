import {  signInWithEmailAndPassword, 
          createUserWithEmailAndPassword, 
          signInWithPopup, 
          onAuthStateChanged, 
          signOut, 
          sendEmailVerification, 
          sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import { ref, set, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { app, auth, database, GoogleProvider } from "./AppConfig.js";



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

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signupUser(email, password)
  })
}

async function waitForEmailVerification(user) {
    if (!user.emailVerified) {
      console.log("please verify your account")
    }
    while (!user.emailVerified) {
      await user.reload();
      await new Promise((resolve) => setTimeout(resolve, 3000)); 
    }
}
  
async function signupUser(email, password) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;
  
      // Sending email verification for the newly created user.
      await sendEmailVerification(user);
    
      // Wait until the email is verified
      await waitForEmailVerification(user);
  
      // Check if the user got signed in
      await checkAuthState();

    } catch (error) {
      console.error(error);
    }
  }


// Signup with Google
const signinWithGoogle = document.querySelector(".signinWithGoogle");

if(signinWithGoogle) {
    signinWithGoogle.addEventListener("click", signinWithGoogle())
}

async function signinWithGoogle() {
  try {
    const result = await signInWithPopup(auth, GoogleProvider)
    const user = result.user;
    
    checkAuthState();

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

    if (user.emailVerified) {
      checkAuthState()
    } 
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
    await checkAuthState();
    window.location.replace("..auth/signin.html");
  } catch (erro) {
    console.log(error.message)
  }
  await signOut(auth)
}

export { logoutUser };