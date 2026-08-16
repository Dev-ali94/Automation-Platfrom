import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, authLoading } = useContext(AppContext);

    // Wait until authentication check is complete
    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Loading...</p>
            </div>
        );
    }

    // User is not logged in
    if (!isLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    // User is logged in
    return children;
};

export default ProtectedRoute;