import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import RootLayout from "./components/RootLayout";
import SingleFood from "./pages/SingleFood";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/food/:id" element={<SingleFood />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
