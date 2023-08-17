import React, { useState } from 'react'; // Removed unused import 'useRef'
import { useAuth } from "../../Context/authContext.js";
import styles from "../../Styles/SignupForm.module.scss";

const Signin = () => {
    const { signupUser } = useAuth();
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleEmailAndUsername = (e) => {
      e.preventDefault();
      // Update the username and email states
      setUsername(e.target.elements.username.value);
      setEmail(e.target.elements.email.value);
  };

  const handlePassword = (e) => {
    e.preventDefault();
    const enteredPassword = e.target.elements.password.value;
    const enteredConfirmPassword = e.target.elements.confirmPassword.value;

    if (enteredPassword === enteredConfirmPassword) {
        setPassword(enteredPassword);
        setConfirmPassword(enteredConfirmPassword);
        signupUser(email, enteredPassword, username);
    } else {
        console.log("Passwords do not match");
    }
};

    return (
        <div className={styles.bodyContainer}>

            {!email || !username ? ( // Use conditional rendering with proper syntax
               <form className={styles.form} onSubmit={handleEmailAndUsername}>
               <h1>Signup</h1>
               <p>Enter your email and username</p>
               <hr />
           
               <label>Username</label>
               <input
                   type="text"
                   name="username" // Added 'name' attribute for form element reference
                   placeholder="Enter your username"
                   required
               />
           
               <label>Email</label>
               <input
                   type="text"
                   name="email" // Added 'name' attribute for form element reference
                   placeholder="Enter your email"
                   required
               />
           
               <button type="submit">Next</button>
           
               <a href="/signin">Already a member? Signin</a>
           </form>

            ) : (

               
          <form className={styles.form} onSubmit={handlePassword}>
              <h1>Signup</h1>
              <p>Enter your Password</p>
              <hr />

              <label>Password</label>
              <input
                  type="password"
                  name="password" // Added 'name' attribute for form element reference
                  placeholder="Enter your password"
                  required
              />

              <label>Confirm Password</label>
              <input
                  type="password"
                  name="confirmPassword" // Added 'name' attribute for form element reference
                  placeholder="Confirm your password"
                  required
              />

              <button type="submit">Next</button>

              <a href="/signin">Already a member? Signin</a>
          </form>
            )}
        </div>
    );
}

export default Signin;