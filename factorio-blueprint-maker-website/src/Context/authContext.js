import { useState, useEffect, createContext, useContext, useLayoutEffect} from 'react';
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { ref, set } from 'firebase/database';
import { database } from '../firebase.js';

const authContext = createContext();

export function useAuth() {
    return useContext(authContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState({});
    const [authenticated, setAuthenticated] = useState(false);


    auth.onAuthStateChanged((user) => {
        setCurrentUser(user);
        localStorage.setItem("currentUser", user?.emailVerified ? user.emailVerified : false);
    });

    useLayoutEffect(() => {
        const storedUser = localStorage.getItem("currentUser")
        const parsedUser = JSON.parse(storedUser);
        setAuthenticated(parsedUser);
    }, [])


    async function signupUser(email, password, username) {

        const user = await createUserWithEmailAndPassword(auth, email, password);

        const userRef = ref(database, "users/" + user.user.uid);

        const userObject = {
            displayName: username,
            email: user.user.email
        }

        await set(userRef, userObject);
    }

    function signinUser(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

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

    function signoutUser() {
        return signOut(auth);
    }

    const value = {
        currentUser,
        authenticated,
        signupUser,
        signinUser,
        signinUserWithGoogle,
        signoutUser
    };

    return (
        <authContext.Provider value={value}>
            { children }
        </authContext.Provider>
    );

}