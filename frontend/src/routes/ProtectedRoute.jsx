import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

function ProtectedRoute({children}) {
    const {token} = useAuth();
    const disableAuth = import.meta.env.VITE_DISABLE_AUTH === "true";

    if (disableAuth) {
      return children; // Always allow in dev
    }
    
    if(!token){
        return <Navigate to="/login" replace/>
    }

    return children;
}

export default ProtectedRoute