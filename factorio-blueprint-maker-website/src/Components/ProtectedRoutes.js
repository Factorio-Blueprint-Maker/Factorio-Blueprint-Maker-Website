import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.js';

const ProtectedRoutes = ({ children }) => {
    
    const { authenticated } = useAuth();
    const navigate = useNavigate();

    if (!authenticated) {
        navigate("../signin");
    } 

    return children;
};

export default ProtectedRoutes;