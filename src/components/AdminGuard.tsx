import { Navigate, Outlet } from "react-router-dom";
import { isAuthenticated } from "../utils/auth";

const AdminGuard = () => {
  if (!isAuthenticated()) {
    return <Navigate to="/admin/login" replace />;
  }
  return <Outlet />;
};

export default AdminGuard;
