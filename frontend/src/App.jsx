import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";

const App = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route path="*" element={<Navigate to="/" replace />} />
  </Routes>
);

export default App;

