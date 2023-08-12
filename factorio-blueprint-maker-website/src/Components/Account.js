import React from 'react';
import { useAuth } from '../Context/authContext.js';
import CreateBlueprint from './CreateBlueprint.js';

// import the styling
import "../App.css"

const Account = () => {

    // get the signout function from authContext
    const { signoutUser } = useAuth();

    // this function handles the signout event and catches potential errors
    const handleSignout = async () => {
        try {
            await signoutUser();
        } catch (error) {
            console.log(error.message);
        }
    }

    return (
        <>
            <div className="signin-form">
                <button type="button" onClick={handleSignout}>Signout</button><br/><br/>
                <CreateBlueprint/>
            </div>
        </>
    );
}

export default Account;