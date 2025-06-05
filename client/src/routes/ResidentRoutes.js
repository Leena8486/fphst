import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import ResidentDashboard from '../pages/ResidentDashboard';
import ResidentProfile from '../components/Resident/ResidentProfile';
import ResidentMaintenance from '../components/Resident/ResidentMaintenance';
import ResidentPayments from '../components/Resident/ResidentPayments';

const ResidentRoutes = () => {
  return (
    <Routes>
      <Route
        path="dashboard"
        element={
          <ProtectedRoute role="Resident">
            <ResidentDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="profile"
        element={
          <ProtectedRoute role="Resident">
            <ResidentProfile />
          </ProtectedRoute>
        }
      />
      <Route
        path="maintenance"
        element={
          <ProtectedRoute role="Resident">
            <ResidentMaintenance />
          </ProtectedRoute>
        }
      />
      <Route
        path="payments"
        element={
          <ProtectedRoute role="Resident">
            <ResidentPayments />
          </ProtectedRoute>
        }
      />
      </Routes>
      
  );
};

export default ResidentRoutes;
