import { Navigate } from "react-router-dom";
import { useUser } from "../../UserProvider";
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { userRole, setUserRole } = useUser();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const checkSession = () => {
      const expiryTime = localStorage.getItem("tokenExpiry");
      if (expiryTime && Date.now() > Number(expiryTime)) {
        logoutUser();
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 10 * 1000);

    return () => clearInterval(interval); 
  }, [userRole]);

  const logoutUser = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    localStorage.removeItem("tokenExpiry");
    setUserRole(null);
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
