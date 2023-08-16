import React, { useState } from 'react';
import factorioBlueprintLogo from '../assets/factorio_blueprint_maker_logo.png'; 
import styles from '../Styles/Header.module.scss';
import { useAuth } from "../Context/authContext.js";

import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import SettingsIcon from '@mui/icons-material/Settings';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';

const Header = () => {

    const [dropdownVisible, setDropdownVisible] = useState(false); 
    const { currentUser, signoutUser } = useAuth();


    const toggleDropdown = () => {
        if (currentUser) {
            setDropdownVisible(!dropdownVisible);
        }
    };

    const closeDropdown = () => {
        setDropdownVisible(false);
    };



    const handleSignout = async () => {
        try {
            await signoutUser();
            closeDropdown();

            // redirect the user to the signin page
            window.location.href = "./signin";

        } catch (error) {
            console.log(error)
        }
    }
    
    return (
        <>
            <div className={styles.navbarContainer}>
                <a href="./" className={styles.navbarLogo}><img src={factorioBlueprintLogo} alt="logo"/></a>
                <div className={styles.navbarLinks}>
                    <ul>
                        <li key="explore"><a href="/explore">Explore</a></li>
                        <li key="donate"><a href="/">Donate</a></li>

                        {currentUser ? (
                            <li key="signout" ><a className={styles.accountIcon} onClick={toggleDropdown}><AccountCircleIcon  sx={{ fontSize: 30 }}/></a></li>
                        ) : (
                            <li key="signin"><a href="/signin">Sign In</a></li>
                        )}
                    </ul>
                </div>
            </div>
            <div className={styles.test}>
            {dropdownVisible && (   

            <ul className={styles.accountDropdown}>
                <li key="accountPage"><ManageAccountsIcon/><a href="/../account" onClick={closeDropdown}>My Account</a></li>
                <li key="myBlueprintsPage"><AppRegistrationIcon/><a href="/../my-blueprints" onClick={closeDropdown}>My Blueprints</a></li>
                <li key="settingsPage"><SettingsIcon/><a href="./" onClick={closeDropdown}>Settings</a></li>
                <li key="helpPage"><HelpIcon/><a href="./" onClick={closeDropdown}>Help</a></li>
                <li key="logoutPage"><LogoutIcon/><a href="./" onClick={handleSignout}>Sign Out</a></li>
            </ul>
               )}
            </div>
     </>
    );
}

export default Header;