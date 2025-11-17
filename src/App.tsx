import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./components/layout/RootLayout";
import SingleFood from "./pages/SingleFood";
import FoodVideos from "./pages/FoodVideos";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/foods/:id" element={<SingleFood />} />
          <Route path="/foods/:id/videos" element={<FoodVideos />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
