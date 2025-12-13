import { Navigate, Outlet } from "react-router-dom";
import useAuthStatus from "../hooks/useAuthStatus";
import Loader from "./Loader";
import { useSelector } from "react-redux";

const SuperAdminRoute = () => {
  const { userExist, checkingUser } = useAuthStatus();
  const { user } = useSelector((state) => state.auth);

  if (checkingUser) {
    return <Loader />;
  }

  // Check if user is logged in AND is a superadmin
  if (userExist && user && user.role === "superadmin") {
    return <Outlet />;
  } else {
    // Redirect to home or login if not authorized
    return <Navigate to="/" />; 
  }
};

export default SuperAdminRoute;
