import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./components/layout/RootLayout";
import SingleFood from "./pages/SingleFood";
import FoodVideos from "./pages/FoodVideos";
import NotFound from "./pages/NotFound";
import FoodSectionProvider from "./contexts/FoodSectionProvider";
import InitialLoadProvider from "./contexts/InitialLoadProvider";
import AdminLayout from "./components/layout/AdminLayout";
import AdminHome from "./pages/admin/AdminHome";
import AdminGuard from "./components/AdminGuard";
import AdminLogin from "./pages/admin/AdminLogin";

function App() {
  return (
    <BrowserRouter>
      <FoodSectionProvider>
        <InitialLoadProvider>
          <Routes>
            <Route path="/" element={<RootLayout />}>
              <Route index element={<Home />} />
              <Route path="/foods/:id" element={<SingleFood />} />
              <Route path="/foods/:id/videos" element={<FoodVideos />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminGuard />}>
              <Route element={<AdminLayout />}>
                <Route index element={<AdminHome />} />
              </Route>
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </InitialLoadProvider>
      </FoodSectionProvider>
    </BrowserRouter>
  );
}

export default App;
