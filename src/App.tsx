import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./components/layout/RootLayout";
import SingleFood from "./pages/SingleFood";
import FoodVideos from "./pages/FoodVideos";
import NotFound from "./pages/NotFound";
import FoodSectionProvider from "./contexts/FoodSectionProvider";
import InitialLoadProvider from "./contexts/InitialLoadProvider";

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
            <Route path="*" element={<NotFound />} />
          </Routes>
        </InitialLoadProvider>
      </FoodSectionProvider>
    </BrowserRouter>
  );
}

export default App;
