import {  signInWithEmailAndPassword, 
          createUserWithEmailAndPassword, 
          signInWithPopup, 
          onAuthStateChanged, 
          signOut, 
          sendEmailVerification, 
          sendPasswordResetEmail,
          updateProfile,
          EmailAuthProvider, 
          reauthenticateWithCredential,
          deleteUser,
          reauthenticateWithPopup } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-auth.js";

import { ref, set, get, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.1.0/firebase-database.js";
import { app, auth, database, GoogleProvider } from "./AppConfig.js";


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

    const username = document.getElementById("username").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value

    signupUser(username, email, password)
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
    updateUI(auth.currentUser)
}

// signs up the user and sends an email verification, if the email gets verified the user gets logged in
async function signupUser(username, email, password) {
    try {
      const credential = await createUserWithEmailAndPassword(auth, email, password);
      const user = credential.user;
  
      // settings the display name
      await updateProfile(user, {
        displayName: username
      })

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

    await sendEmailVerification(user); 

    await waitForEmailVerification(user)
    
  } catch (error) {
    console.error(error.message);
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

// this function adds the user credentials to the realtime database
async function addUserToDatabase(credentials) {

  console.log("hey")

  const user = credentials.user;
  const userDbReference = ref(database, "users/" + user.uid)

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



















// this function is for reauthenticating the user for sensitive operations such as deleting accounts or changing passwords
async function reauthenticateUser(user, maxRetries = 20) {
  const reauthContainer = document.getElementById('reauthContainer');
  const reauthUrl = "../reauth.html";

  try {
    if (user.providerData[0].providerId === "google.com") {
      await reauthenticateWithPopup(user, GoogleProvider);
    } else {
      const response = await fetch(reauthUrl);
      const reauthContent = await response.text();
      reauthContainer.innerHTML = reauthContent;

      const credentialsPromise = new Promise((resolve, reject) => {
        const submitButton = document.querySelector(".reauth");
        submitButton.addEventListener("click", () => {
          const email = document.getElementById("email").value;
          const password = document.getElementById("password").value;

          if (email && password) {
            resolve({ email, password });
          } else {
            reject(new Error("Email and password are required"));
          }
        });
      });

      const { email, password } = await credentialsPromise;
      const credential = await EmailAuthProvider.credential(email, password);
      await reauthenticateWithCredential(user, credential);
    }

    console.log("Reauth was successful!");
  } catch (error) {
    if (maxRetries > 0) {
      console.log(`Reauthentication failed: ${error.message}`);
      await reauthenticateUser(user, maxRetries - 1);
    } else {
      console.log("Max reauthentication retries reached. Aborting.");
      throw error;
    }
  }
}


const deleteAccountBtn = document.getElementById("delete-account-button")
if (deleteAccountBtn) {
  deleteAccountBtn.addEventListener("click", deleteAccount)
}

async function deleteAccount() {

  try {
    const user = auth.currentUser

    // reauthenticate the user before it gets deleted
    await reauthenticateUser(user)
    await deleteUser(user)

    console.log("User deleted successfully!")

  } catch(error) {
    console.error(error.message)
  }
}



export { logoutUser, checkAuthState };
