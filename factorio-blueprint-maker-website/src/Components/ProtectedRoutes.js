
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.js';
import { useEffect, useState } from 'react';

const ProtectedRoutes = ({ children }) => {
    const { authenticated, currentUser } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
            return; // Wait until loading is resolved
        }

        if (!currentUser) {
            navigate("/signin"); 
        } else if (currentUser && !authenticated) {
            navigate("/verify-email")
        }
    }, [authenticated, currentUser, loading, navigate]);

    useEffect(() => {
        setLoading(false); // Set loading to false after initial render
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return authenticated ? children : null; // Render children only if authenticated
};

export default ProtectedRoutes;