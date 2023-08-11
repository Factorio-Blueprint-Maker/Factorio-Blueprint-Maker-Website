import React from 'react';
import factorioBlueprintLogo from '../assets/factorio_blueprint_maker_logo.png'; 
import "../App.css";
import { useAuth } from "../Context/authContext.js";

const Header = () => {

    const { currentUser } = useAuth();

    return (
        <div className="navbar">
            <a href="./" className="logo"><img src={factorioBlueprintLogo} alt="logo"/></a>
            <div className="navbar-links">
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