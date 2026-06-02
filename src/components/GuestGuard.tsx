import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

/**
 * Wraps routes that should only be accessible when logged OUT.
 * Logged-in users are immediately redirected to /my-recipes.
 */
const GuestGuard = () => {
  const { user, loading } = useContext(AuthContext);

  // Wait for the auth bootstrap to finish before deciding
  if (loading) return null;

  if (user) return <Navigate to="/my-recipes" replace />;

  return <Outlet />;
};

export default GuestGuard;
