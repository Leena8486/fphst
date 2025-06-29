// App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

import AuthPage from './components/AuthPage';
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageRooms from './pages/admin/ManageRooms';
import ManageUsers from './pages/admin/ManageUsers';
import AdminMaintenance from './pages/admin/AdminMaintenance';
import PaymentSuccess from "./pages/PaymentSuccess";
import AdminPaymentDashboard from "./components/AdminPaymentDashboard";
import AdminPaymentSummary from "./components/AdminPaymentSummary";
import ResidentRoutes from './routes/ResidentRoutes';
import ResidentProfile from './components/Resident/ResidentProfile';
import ResidentDashboard from './pages/ResidentDashboard';
import StaffDashboard from './components/StaffDashboard';
import AdminStaffDashboard from './components/AdminStaffDashboard';
import CheckResident from './components/CheckResident';


import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <ToastContainer position="top-right" autoClose={3000} />
      <Routes>
        {/* Auth */}
        <Route path="/login" element={<AuthPage />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={
          <ProtectedRoute role="Admin">
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/manage-rooms" element={
          <ProtectedRoute role="Admin">
            <ManageRooms />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute role="Admin">
            <ManageUsers />
          </ProtectedRoute>
        } />
        <Route path="/admin/maintenance" element={
          <ProtectedRoute role="Admin">
            <AdminMaintenance />
          </ProtectedRoute>
        } />
        <Route path="/admin/staff" element={
          <ProtectedRoute role="Admin">
            <AdminStaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/payments" element={
          <ProtectedRoute role="Admin">
            <AdminPaymentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/payments/summary" element={
          <ProtectedRoute role="Admin">
            <AdminPaymentSummary />
          </ProtectedRoute>
        } />

        {/* Staff */}
        <Route path="/staff/dashboard" element={
          <ProtectedRoute role="Staff">
            <StaffDashboard />
          </ProtectedRoute>
        } />
        <Route path="/staff/check-resident" element={
          <ProtectedRoute role="Staff">
            <CheckResident />
          </ProtectedRoute>
        } />
        <Route path="/payment-success" element={<PaymentSuccess />} />


        {/* Resident Routes (Specific before wildcard) */}
        <Route path="/resident/profile" element={
          <ProtectedRoute role="Resident">
            <ResidentProfile />
          </ProtectedRoute>
        } />
        <Route path="/resident/dashboard" element={
          <ProtectedRoute role="Resident">
            <ResidentDashboard />
          </ProtectedRoute>
        } />
        <Route path="/resident/*" element={<ResidentRoutes />} />

        {/* Payment Success */}
        <Route path="/payment-success" element={<PaymentSuccess />} />
 <Route path="/admin/maintenance" element={<AdminMaintenance />} />
        {/* Catch-all fallback */}
        <Route path="*" element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
