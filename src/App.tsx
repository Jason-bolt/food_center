import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./components/RootLayout";
import SingleFood from "./pages/SingleFood";
import FoodVideos from "./pages/FoodVideos";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/foods/:id" element={<SingleFood />} />
          <Route path="/foods/:id/videos" element={<FoodVideos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
