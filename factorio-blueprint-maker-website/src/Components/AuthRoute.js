import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.js';


const AuthRoute = ({ children }) => {
    
    const { authenticated, currentUser } = useAuth();
    const [loading, setLoading] = useState(true)

    const navigate = useNavigate();

    
    useEffect(() => {

        // if user is authenticated navigate to /account else use children
        if (authenticated) {
            navigate("/account")
        }

        setLoading(false);

    }, [authenticated, currentUser, navigate]);


    // return children if the user isn't authenticated
    return !loading && !authenticated ? children : null;
};

export default AuthRoute;