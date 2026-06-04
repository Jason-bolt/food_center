import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";

// ─── Eagerly loaded — part of the critical first paint ───────────────────────
import Home from "./pages/Home";
import RootLayout from "./components/layout/RootLayout";
import NotFound from "./pages/NotFound";
import FoodSectionProvider from "./contexts/FoodSectionProvider";
import InitialLoadProvider from "./contexts/InitialLoadProvider";
import AdminGuard from "./components/AdminGuard";
import AIChefLayout from "./components/layout/AIChefLayout";
import AuthProvider from "./contexts/AuthProvider";
import GuestGuard from "./components/GuestGuard";
import StreakToast from "./components/StreakToast";

// ─── Lazily loaded — split into separate chunks ───────────────────────────────
const SingleFood     = lazy(() => import("./pages/SingleFood"));
const FoodVideos     = lazy(() => import("./pages/FoodVideos"));
const Login          = lazy(() => import("./pages/Login"));
const Register       = lazy(() => import("./pages/Register"));
const MyRecipes      = lazy(() => import("./pages/MyRecipes"));
const MealPlanner    = lazy(() => import("./pages/MealPlanner"));
const Pantry         = lazy(() => import("./pages/Pantry"));
const Profile        = lazy(() => import("./pages/Profile"));
const Pricing        = lazy(() => import("./pages/Pricing"));
const UpgradeSuccess = lazy(() => import("./pages/UpgradeSuccess"));
const Developer      = lazy(() => import("./pages/Developer"));
const AIChef         = lazy(() => import("./pages/AIChef"));
const AdminLayout    = lazy(() => import("./components/layout/AdminLayout"));
const AdminHome      = lazy(() => import("./pages/admin/AdminHome"));
const AdminLogin     = lazy(() => import("./pages/admin/AdminLogin"));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <FoodSectionProvider>
          <InitialLoadProvider>
            <StreakToast />
            <Suspense fallback={null}>
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
                  <Route path="/developer" element={<Developer />} />
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
            </Suspense>
          </InitialLoadProvider>
        </FoodSectionProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
