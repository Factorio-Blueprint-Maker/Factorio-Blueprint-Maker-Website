import React, { useState, createContext, useContext, useLayoutEffect } from 'react';
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, sendEmailVerification } from "firebase/auth";
import { ref, set, get } from 'firebase/database';
import { database } from '../firebase.js';

const authContext = createContext();

export function useAuth() {
    return useContext(authContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState({});
    const [authenticated, setAuthenticated] = useState(false);
    
    const refreshAuthenticationState = async () => {
        try {
            await currentUser?.reload();
            setAuthenticated(currentUser?.emailVerified);
        } catch (error) {
            console.error("Error refreshing authentication state:", error);
        }
    };
    
    auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
        setAuthenticated(user?.emailVerified);
        localStorage.setItem("currentUser", user ? JSON.stringify(user) : null);
    });
    
    useLayoutEffect(() => {
        const storedUser = localStorage.getItem("currentUser");
        const parsedUser = storedUser ? JSON.parse(storedUser) : null;
        setAuthenticated(parsedUser && parsedUser.emailVerified);
    }, []);


    // this method handles the signup of the user. First it creates an account on firebase and then imports the data to the database
    async function signupUser(email, password, username) {

        const user = await createUserWithEmailAndPassword(auth, email, password);

        const userRef = ref(database, "users/" + user.user.uid);

        const userObject = {
            displayName: username,
            email: user.user.email
        }

        await set(userRef, userObject);
    }


    // this method handles the signin of a user
    async function signinUser(email, password) {
        return await signInWithEmailAndPassword(auth, email, password);
    }


    // this method handles the signin with Google provider and importing of user data to database
    async function signinUserWithGoogle() {
        
        const GoogleProvider = new GoogleAuthProvider();
        const user = await signInWithPopup(auth, GoogleProvider);
        
        const userRef = ref(database, "users/" + user.user.uid);

        const userObject = {
            displayName: user.user.displayName,
            email: user.user.email
        }

        await set(userRef, userObject);
        return user;
    } 


    // this method provides signout for the user
    function signoutUser() {
        return signOut(auth);
    }

    // this method sends an email verification link to the user
    async function sendVerificationLink() {
        await sendEmailVerification(currentUser);
    }


    // this methods gets the username of a given id
    const getUsernameFromId = async (userId) => {

        const userRef = ref(database, "users/" + userId);
    
        try {
            const snapshot = await get(userRef);
    
            if (snapshot.exists()) {
                const data = snapshot.val();
                const username = data.displayName;
                return username;
            } 
        } catch (error) {
            console.error("Error fetching user data:", error);
            throw error; // Rethrow the error to handle it later
        }
    }

    const value = {
        currentUser,
        authenticated,
        signupUser,
        signinUser,
        signinUserWithGoogle,
        signoutUser,
        sendVerificationLink,
        refreshAuthenticationState,
        getUsernameFromId
    };

    return (
        <authContext.Provider value={value}>
            { children }
        </authContext.Provider>
    );

}