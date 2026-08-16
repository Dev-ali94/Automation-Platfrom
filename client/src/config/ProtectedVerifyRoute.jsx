import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

const VerifyEmailRoute = ({ children }) => {
  const { userData, loading } = useContext(AppContext);

  // Wait until user data is loaded
  if (loading) {
    return <div>Loading...</div>;
  }

  // If already verified, don't allow /verify-email
  if (userData?.verified === true) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default VerifyEmailRoute;