import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.js';
import styles from '../Styles/SigninForm.module.scss';

import GoogleLogo from '../assets/google_logo.png';
import SteamLogo from '../assets/steam_logo.png';

const Signin = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // Add a loading state
    const { signinUser, signinUserWithGoogle } = useAuth();
    const navigate = useNavigate();


    const handleSigninUser = async () => {
        try {
            await signinUser(email, password);
            setLoading(true); 
        } catch (error) {
            console.log(error.message);
        } 
    }

    const handleSigninWithGoogle = async () => {
        try {
            await signinUserWithGoogle();
            setLoading(true); 
        } catch (error) {
            console.log(error.message);
        } 
    }


    useEffect(() => {
        if (loading) {
            navigate('/account');
        }
    }, [loading, navigate]);

    return (
        <div className={styles.bodyContainer}>                  

            <div className={styles.signInForm}>

            <div className={styles.textContainer}>
                    <h1>Welcome</h1>
                    <p>Sign in to continue</p>
            </div>

                    <input type="text" className="" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                    <input type="password" className="" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} /><br />
                    <button type="button" onClick={handleSigninUser} className={styles.signInBtn}>Sign In</button><br />
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

                {loading && <p>Loading...</p>} {/* Show loading indicator if loading */}
                <a href="/signup" className={styles.registerLink}>Register with email</a>
            </div>
        </div>
    );
}

export default Signin;
