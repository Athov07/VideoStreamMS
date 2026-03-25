import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { 
  LayoutDashboard, 
  Users, 
  Video, 
  ShieldAlert, 
  LogOut, 
  Search,
  Settings,
  UserCog,
  Activity,
  BadgeIndianRupee,
  Tickets
} from 'lucide-react';

const AdminLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Overview", icon: <LayoutDashboard size={20}/> },
    { to: "/admin/users", label: "Manage Users", icon: <UserCog size={20}/> },
    { to: "/admin/videos", label: "Video Moderation", icon: <Video size={20}/> },
    { to: "/admin/profiles", label: "Profile Manager", icon: <Users size={20}/> },
    { to: "/admin/interactions", label: "Interaction Manager", icon: <Activity size={20}/> },
    { to: "/admin/plans", label: "Manage Plans", icon: <Tickets size={20}/> },
    { to: "/admin/payments", label: "Manage Payments", icon: <BadgeIndianRupee size={20}/> },
    { to: "/dashboard", label: "User View", icon: <Settings size={20}/> }, // Switch back to user view
  ];

  return (
    <div className="flex h-screen bg-background text-surface-text font-sans">
      {/* --- ADMIN SIDEBAR --- */}
      <aside className="w-64 bg-surface border-r border-background-accent flex flex-col">
        <div className="p-6">
          <Link to="/admin/dashboard" className="text-2xl font-bold text-blue-700">
            Admin<span className="text-primary">Panel</span>
          </Link>
          <div className="mt-2 inline-block px-2 py-1 bg-red-600/10 text-red-600 text-[10px] rounded uppercase">
            Superuser Access
          </div>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              end={item.to === "/admin/dashboard"}
              className={({ isActive }) => 
                `flex items-center gap-3 p-3 rounded-md transition-all ${
                  isActive 
                    ? 'bg-primary/20 text-primary border-r-4 border-primary' 
                    : 'hover:bg-background-secondary text-surface-muted'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-background-accent">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-red-400 hover:bg-red-400/10 rounded-md transition-colors"
          >
            <LogOut size={20}/>
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* --- Navbar --- */}
        <header className="h-16 border-b border-background-accent flex items-center justify-between px-8 bg-background-secondary/80 backdrop-blur-md">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-surface-muted">
                <Search size={16} />
              </span>
              <input 
                type="text"
                placeholder="Search users or logs..."
                className="input-field pl-10 rounded-full bg-background border-none h-10 shadow-inner w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <div className="text-right">
              <p className="text-xs text-red-400 font-bold uppercase tracking-tighter">Administrator</p>
              <p className="text-sm font-medium">{user?.email || 'Admin'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30 shadow-lg text-red-500 font-bold">
              {user?.email?.substring(0, 2).toUpperCase() || 'AD'}
            </div>
          </div>
        </header>

        {/* --- Main Area --- */}
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;