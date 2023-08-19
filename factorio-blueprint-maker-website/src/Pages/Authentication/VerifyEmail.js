import React, { useEffect } from "react";
import styles from "../../Styles/VerifyEmail.module.scss";
import VerifyEmailIcon from "../../assets/VerifyEmail.png";
import { useAuth } from "../../Context/authContext.js";


const VerifyEmail = () => {

    const { currentUser, sendVerificationLink, refreshAuthenticationState, authenticated } = useAuth();

    const handleVerificationLink = () => {
        if (!authenticated) {
            sendVerificationLink();
        } 
    }

    useEffect(() => {

        const checkVerificationStatus = async () => {
            await refreshAuthenticationState();
        }; 

        const intervalId = setInterval(checkVerificationStatus, 1000);

        return () => {
            clearInterval(intervalId);
        };
    }, [currentUser, refreshAuthenticationState]);


    return (

        <div className={styles.bodyContainer}>
            <div className={styles.container}>
                <img src={VerifyEmailIcon} alt="verify email" />
                <h1>Verify your email address</h1>
                <p>You've entered <b>{currentUser && currentUser.email}</b> as the email address for your account. Please verify this email address</p>
                <button className={styles.sendVerificationEmailBtn} onClick={handleVerificationLink}>Send Verification</button>
                <a href="./">Have any question? Please contact us!</a>
            </div>
       
       </div>
       );
}

export default VerifyEmail;