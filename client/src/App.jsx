import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AuthCallback from "./pages/AuthCallback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import DashboardLayout from "./components/layout/DashboardLayout";
import Home from "./pages/dashboard/Home";
import VideoDetails from "./pages/dashboard/VideoDetails";
import MyVideos from './pages/dashboard/MyVideos';
import Profile from "./pages/dashboard/Profile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLayout from "./components/layout/AdminLayout";
import ManageUsers from "./pages/admin/ManageUsers"
import AdminContent from "./pages/admin/AdminContent"


function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background">
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route element={<ProtectedRoute />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<Home />} />
              <Route
                path="/dashboard/my-videos"
                element={<MyVideos/>}
              />
              <Route
                path="/dashboard/profile"
                element={<Profile/>}
              />
              <Route path="/watch/:id" element={<VideoDetails />} />
            </Route>
          </Route>

          {/* ADMIN Protected Routes */}
          <Route element={<ProtectedRoute adminOnly={true} />}>
            <Route element={<AdminLayout />}> 
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<ManageUsers />} />
              <Route path="/admin/videos" element={<AdminContent />} />
            </Route>
          </Route>


          {/* Default Redirect */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
