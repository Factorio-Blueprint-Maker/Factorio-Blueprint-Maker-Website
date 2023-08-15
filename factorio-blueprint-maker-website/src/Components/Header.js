import React from 'react';
import factorioBlueprintLogo from '../assets/factorio_blueprint_maker_logo.png'; 
import styles from '../Styles/Header.module.scss';
import { useAuth } from "../Context/authContext.js";

const Header = () => {

    const { currentUser } = useAuth();

    return (
        <div className={styles.navbarContainer}>
            <a href="./" className={styles.navbarLogo}><img src={factorioBlueprintLogo} alt="logo"/></a>
            <div className={styles.navbarLinks}>
                <ul>
                    <li key="explore"><a href="/explore">Explore</a></li>
                    <li key="donate"><a href="/">Donate</a></li>

                    {currentUser ? (
                        <li key="signout"><a href="/account">Account</a></li>
                    ) : (
                        <li key="signin"><a href="/signin">Signin</a></li>
                    )}
                </ul>
            </div>
        </div>
    );
}

export default Header;