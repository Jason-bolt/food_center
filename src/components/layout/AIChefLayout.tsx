import { useEffect } from "react";
import Navbar from "../Navbar";
import { Outlet, useLocation } from "react-router-dom";

const AIChefLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-screen">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default AIChefLayout;
