import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ adminOnly = false }) => {
  const token = localStorage.getItem('accessToken');
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If route is admin only but user is a regular 'user'
  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;