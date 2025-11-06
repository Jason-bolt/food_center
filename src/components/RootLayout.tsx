import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { Outlet, useLocation } from "react-router-dom";

const RootLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const onSearchChange = (query: string) => {
    setSearchQuery(query);
    console.log("Search query:", query);
  };

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <section className="cursor-w-resize">
      <Navbar searchQuery={searchQuery} onSearchChange={onSearchChange} />
      <section className="pointer-events-none fixed">
        <div className="relative flex h-screen w-screen items-center justify-center gap-3 overflow-hidden">
          {/* Display search and filter values */}
          {searchQuery && (
            <div className="absolute bottom-20 left-1/2 z-20 -translate-x-1/2 transform rounded-2xl border border-white/30 bg-white/20 p-4 backdrop-blur-sm">
              <div className="text-center text-gray-800">
                {searchQuery && (
                  <p className="mb-1 text-sm">
                    🔍 Search:{" "}
                    <span className="font-semibold">{searchQuery}</span>
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </section>
      <main className="mx-auto w-full px-4">
        <Outlet />
      </main>
      <footer className="mt-10 flex items-center justify-center bg-gray-50 py-10">
        <p className="text-sm">&copy; 2025 My Application</p>{" "}
      </footer>
    </section>
  );
};

export default RootLayout;
