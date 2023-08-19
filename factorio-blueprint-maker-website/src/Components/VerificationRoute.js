import { useEffect, useState } from "react";
import { useAuth } from "../Context/authContext";
import { useNavigate } from "react-router-dom";

const VerificationRoute = ({ children }) => {
    const { currentUser, authenticated } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!currentUser) {
            navigate("/signin");
        } else if (authenticated) {
            navigate("/account");
        }

        setLoading(false);

    }, [authenticated, currentUser, navigate]);

    
    return !loading && (currentUser || !authenticated) ? children : null;

}

export default VerificationRoute;


