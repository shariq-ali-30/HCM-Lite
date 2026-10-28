
import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/employee" element={<EmployeeDashboard />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
