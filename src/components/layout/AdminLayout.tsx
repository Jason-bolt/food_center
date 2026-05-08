import { useEffect } from "react";
import Navbar from "../Navbar";
import { Outlet, useLocation } from "react-router-dom";
import backgroundAfrica from "../../assets/backgroundAfrica.png";

const AdminLayout = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <section
      style={{
        backgroundImage: `url(${backgroundAfrica})`,
        backgroundSize: "900px",
      }}
    >
      <Navbar basePath="/admin" />
      <main className="mx-auto w-full px-4">
        <Outlet />
      </main>
      <footer className="mt-10 flex items-center justify-center border-t border-orange-200 bg-gray-50 py-10">
        <p className="text-sm">&copy; 2025 My Application</p>{" "}
      </footer>
    </section>
  );
};

export default AdminLayout;
