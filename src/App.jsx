import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";

import AdminDashboard from "./pages/AdminDashboard.jsx";
// import EmployeeDashboard from "./pages/EmployeeDashboard.jsx";
import Login from "./pages/Login.jsx";

import Dashboard from "./components/Dashboard.jsx";
import Employees from "./components/Employees.jsx";
import LeaveRequests from "./components/LeaveRequests.jsx";
import Settings from "./components/Settings.jsx";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />

        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminDashboard />}>
          {/* Default Admin Route */}
          <Route index element={<Navigate to="dashboard" />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="employees" element={<Employees />} />
          <Route path="leave-requests" element={<LeaveRequests />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Employee Route */}
        {/* <Route path="/employee" element={<EmployeeDashboard />} /> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;