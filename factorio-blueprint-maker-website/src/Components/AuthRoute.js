import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/authContext.js';

const AuthRoute = ({ children }) => {

    const { authenticated } = useAuth();
    const navigate = useNavigate();

    if (authenticated) {
        navigate("../account");
    } 

    return children;
};

export default AuthRoute;