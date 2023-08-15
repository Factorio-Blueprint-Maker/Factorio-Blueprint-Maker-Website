import React, { useState } from 'react';
import "../App.css";
import { useAuth } from "../Context/authContext.js";
import { ref, set } from 'firebase/database';
import '../App.css'
import { database } from '../firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const Signin = () => {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {signupUser, currentUser, updateUser } = useAuth();

    const handleSignupUser = async () => {
      try {
          // Attempt to sign up the user
          await signupUser(email, password);
          await updateUser(username);

          // Listen for changes in authentication state
          const unsubscribe = onAuthStateChanged(auth, (user) => {
              if (user) {
                
                  const databaseRef = ref(database, "users/" + user.uid);
  
                  const userData = {
                      userName: user.displayName,
                      userEmail: user.email
                  };
  
                  // Set user data in the database
                  set(databaseRef, userData);
                  
                  // Unsubscribe from the listener to avoid memory leaks
                  unsubscribe();
              }
          });
  
      } catch (error) {
          console.log(error.message);
      }
  }
    return (
      <>
      <div className="signin-form">
        <input type="text" className="username_input_field" placeholder="Eneter your username" onChange={(e) => setUsername(e.target.value)} />
        <input type="text" className="email_input_field" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
        <input type="password" className="password_input_field" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} /><br />
        <button type="button" onClick={handleSignupUser}>Sign up</button>
        {currentUser && currentUser.email}<br />
        <a href="/signin">Already have an account?</a>
      </div> 
      </>
    );
}

export default Signin;