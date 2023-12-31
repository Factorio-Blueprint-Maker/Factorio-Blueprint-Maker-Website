import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../Context/authContext.js';

import styles from '../../Styles/SigninForm.module.scss';

import GoogleLogo from '../../assets/google_logo.png';
import SteamLogo from '../../assets/steam_logo.png';


const Signin = () => {
    
    const { signinUser, signinUserWithGoogle } = useAuth();
    const navigate = useNavigate();

    const emailInput = useRef();
    const passwordInput = useRef();

    const handleSigninUser = async (e) => {

        e.preventDefault();

        await signinUser(emailInput.current.value, passwordInput.current.value);
        navigate("/account")
    }

    const handleSigninWithGoogle = async () => {
        try {
            await signinUserWithGoogle();
            navigate("/account")

        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <div className={styles.bodyContainer}>                  

            <form className={styles.signInForm} onSubmit={(e) => handleSigninUser(e)}>

                <div className={styles.textContainer}>
                        <h1>Welcome</h1>
                        <p>Sign in to continue</p>
                </div>

                <input type="text" ref={emailInput} placeholder="Enter your email" required />
                <input type="password" ref={passwordInput} placeholder="Enter your password" required /><br />

                <button type="submit" className={styles.signInBtn}>Sign In</button><br />
                <a href="/" className={styles.forgotPasswordLink}>Forgot your password?</a>

                <div className={styles.middleContainer}>
                    <hr/><p>or</p><hr/>
                </div>

                <button type="button" onClick={handleSigninWithGoogle} className={styles.signInWithGoogleBtn}>
                    <img src={GoogleLogo} alt="Google logo" />
                    <p>Continue with Google</p>
                </button>

                <button type="button" className={styles.signInWithSteamBtn}>
                    <img src={SteamLogo} alt="Steam logo" />
                    <p>Continue with Steam</p>
                </button>

                <a href="/signup" className={styles.registerLink}>Register with email</a>

            </form>
        </div>
    );
}

export default Signin;
