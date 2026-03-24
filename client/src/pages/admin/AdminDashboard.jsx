import React from "react";
import { authService } from "../../services/auth.service.js";

const AdminDashboard = () => {
  const user = authService.getCurrentUser();

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold text-primary mb-4">Admin Command Center</h1>
      <div className="bg-surface border border-background-accent p-6 rounded-2xl shadow-xl">
        <h2 className="text-xl font-semibold mb-2">Welcome, {user?.firstName || 'Administrator'}</h2>
        <p className="text-surface-muted mb-6">You are logged in with full administrative privileges.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-primary/10 border border-primary/20 rounded-xl">
            <p className="text-xs uppercase text-primary font-bold">System Status</p>
            <p className="text-lg">All Systems Operational</p>
          </div>
          {/* Add more admin-specific tiles here */}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;