import React, {useEffect} from "react";
import AppPreview from '../../assets/AppPreview.png'; 
import AppleLogo from '../../assets/Apple-Logo.png';
import GooglePlayLogo from '../../assets/GooglePlay-Logo.png';
import styles from "../../Styles/AboutApp.module.scss";
import { useAuth } from "../../Context/authContext";

const AboutApp = () => {
    const {currentUser, authenticated} = useAuth();

    useEffect(() => {
        console.log(authenticated);
    }, [authenticated])
    return (
        <>
            <div className={styles.container}>
                <div className={styles.textContainer}>
                    <h1>Download the App</h1>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, rcitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    <div className={styles.buttons}>
                        <button className={styles.downloadApple}>
                            <img src={AppleLogo} alt="Apple Logo"/>
                            <p>Download Now</p>
                        </button>
                        <button className={styles.downloadGooglePlayStore}>
                            <img src={GooglePlayLogo} alt="Google Play Logo"/>
                            <p>Download Now</p>
                        </button>
                    </div>
                </div>
                <div className={styles.previewContainer}>
                    <img src={AppPreview} alt="App Preview" />
                </div>
            </div>
        </>
    );
}

export default AboutApp;