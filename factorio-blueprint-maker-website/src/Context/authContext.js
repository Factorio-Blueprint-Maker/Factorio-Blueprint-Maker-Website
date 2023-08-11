import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const authContext = createContext();

export function useAuth() {
    return useContext(authContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState({});

    function signupUser(username, email, password) {
        return createUserWithEmailAndPassword(auth, email, password);
    }

    function signinUser(email, password) {
        return signInWithEmailAndPassword(auth, email, password);
    }

    function signinUserWithGoogle() {
        const GoogleProvider = new GoogleAuthProvider();
        return signInWithPopup(auth, GoogleProvider);
    } 

    function signoutUser() {
        return signOut(auth);
    }

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
            setCurrentUser(user);
        });    
    
      return unsubscribe;
    }, []);


    const value = {
        currentUser,
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