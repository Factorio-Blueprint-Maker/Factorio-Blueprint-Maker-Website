import React, { useState } from 'react';
import factorioBlueprintLogo from '../assets/factorio_blueprint_maker_logo.png'; 
import styles from '../Styles/Header.module.scss';
import { useAuth } from "../Context/authContext.js";

import AccountCircleIcon from '@mui/icons-material/AccountCircle'; 
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import HelpIcon from '@mui/icons-material/Help';
import LogoutIcon from '@mui/icons-material/Logout';
import StarIcon from '@mui/icons-material/Star';


const Header = () => {

    const [dropdownVisible, setDropdownVisible] = useState(false); 
    const { signoutUser, authenticated } = useAuth();

    const toggleDropdown = (e) => {
        
        e.preventDefault();

        if (authenticated) {
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
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className={styles.navbarContainer}>
                <a href="/explore" className={styles.navbarLogo}><img src={factorioBlueprintLogo} alt="logo"/></a>
                <div className={styles.navbarLinks}>
                    <ul>
                        <li key="app"><a href="/about-app">Download</a></li>
                        <li key="explore"><a href="/explore">Explore</a></li>
                        <li key="donate"><a href="/">Donate</a></li>
                
                            { authenticated === true ? (
                                <li key="signout">
                                    <a href="/" className={styles.accountIcon} onClick={(e) => toggleDropdown(e)}>
                                        <AccountCircleIcon sx={{ fontSize: 30 }} />
                                    </a>
                                </li>
                            ) : (
                                <li key="signin">
                                    <a href="/signin">Sign In</a>
                                </li>
                            )}
                        

                    </ul>
                </div>
            </div>


            
            <div className={styles.dropDownContainer}>
            {dropdownVisible && (   

            <ul className={styles.accountDropdown}>
                <li key="accountPage"><ManageAccountsIcon/><a href="/account" onClick={closeDropdown}>My Account</a></li>
                <li key="myBlueprintsPage"><AppRegistrationIcon/><a href="/my-blueprints" onClick={closeDropdown}>My Blueprints</a></li>
                <li key="myCollectionsPage"><AutoStoriesIcon/><a href="/" onClick={closeDropdown}>My Collections</a></li>
                <li key="MyFavoritesPage"><StarIcon/><a href="/my-favorites" onClick={closeDropdown}>My Favorites</a></li>
                <hr/>
                <li key="helpPage"><HelpIcon/><a href="/" onClick={closeDropdown}>Help</a></li>
                <li key="logoutPage"><LogoutIcon/><a href="/" onClick={handleSignout}>Sign Out</a></li>
            </ul>
               )}
            </div>
     </>
    );
}

export default Header;