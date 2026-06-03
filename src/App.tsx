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
import AIChefLayout from "./components/layout/AIChefLayout";
import AIChef from "./pages/AIChef";
import AuthProvider from "./contexts/AuthProvider";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MyRecipes from "./pages/MyRecipes";
import GuestGuard from "./components/GuestGuard";
import MealPlanner from "./pages/MealPlanner";
import Pantry from "./pages/Pantry";
import Profile from "./pages/Profile";
import StreakToast from "./components/StreakToast";
import Pricing from "./pages/Pricing";
import UpgradeSuccess from "./pages/UpgradeSuccess";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FoodSectionProvider>
          <InitialLoadProvider>
            <StreakToast />
            <Routes>
              <Route path="/" element={<RootLayout />}>
                <Route index element={<Home />} />
                <Route path="/foods/:id" element={<SingleFood />} />
                <Route path="/foods/:id/videos" element={<FoodVideos />} />
                <Route element={<GuestGuard />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                </Route>
                <Route path="/my-recipes" element={<MyRecipes />} />
                <Route path="/meal-planner" element={<MealPlanner />} />
                <Route path="/pantry" element={<Pantry />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/pricing" element={<Pricing />} />
                <Route path="/upgrade/success" element={<UpgradeSuccess />} />
              </Route>
              <Route path="/ai" element={<AIChefLayout />}>
                <Route index element={<AIChef />} />
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
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
