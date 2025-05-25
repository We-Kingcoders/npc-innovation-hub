import { Routes, Route } from "react-router-dom";
import HireUs from "./hire-us/HireUs.tsx"; // 👈 your new component

function App() {
  return (
    <Routes>
      <Route path="/hire-us" element={<HireUs />} /> {/* 👈 your new route */}
    </Routes>
  );
}

export default App;
