import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.js';

import '../App.css';

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
        <>
            <div className="signin-form">
                <input type="text" className="email_input_field" placeholder="Enter your email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" className="password_input_field" placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} /><br />
                <button type="button" onClick={handleSigninUser}>Signin</button><br />
                <button type="button" onClick={handleSigninWithGoogle}>Sign in with Google</button>
                {loading && <p>Loading...</p>} {/* Show loading indicator if loading */}
                <a href="/signup">Register with email</a>
            </div>
        </>
    );
}

export default Signin;
