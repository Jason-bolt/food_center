import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import RootLayout from "./components/RootLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
