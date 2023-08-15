import { useState, useEffect, createContext, useContext } from 'react';
import { auth } from "../firebase.js";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from 'react-router-dom';

const authContext = createContext();

export function useAuth() {
    return useContext(authContext);
}

export function AuthProvider({ children }) {

    const [currentUser, setCurrentUser] = useState({});

    function signupUser(email, password) {
        return createUserWithEmailAndPassword(auth, email, password)
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

    function updateUser(username) {
        
        return updateProfile(auth.currentUser, {displayName: username});
    
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
        signoutUser,
        updateUser
    };

    return (
        <authContext.Provider value={value}>
            { children }
        </authContext.Provider>
    );

}