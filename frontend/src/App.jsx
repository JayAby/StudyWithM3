import { Routes, Route, Navigate } from "react-router-dom";
import Setup from "./pages/setup";
import Dashboard from "./pages/Dashboard";
import Assessments from "./pages/Assessments";

export default function App(){
  return(
    <Routes>
      <Route path="/" element={<Navigate to="/setup" replace />} />
      <Route path="/setup" element={<Setup />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/assessments" element={<Assessments />} />
    </Routes>
  );
}