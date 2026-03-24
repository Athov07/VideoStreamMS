import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { 
  Home, 
  Video, 
  User as UserIcon, 
  LogOut, 
  Search,
  PlaySquare
} from 'lucide-react';

const DashboardLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  
  // Get real user data from your service
  const user = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout(); // Uses the service method we added earlier
    navigate('/login');
  };

  const navItems = [
    { to: "/dashboard", label: "Home", icon: <Home size={20}/>, end: true },
    { to: "/dashboard/my-videos", label: "My Videos", icon: <Video size={20}/>, end: false },
    { to: "/dashboard/profile", label: "Profile", icon: <UserIcon size={20}/>, end: false },
  ];

  return (
    <div className="flex h-screen bg-background text-surface-text font-sans">
      {/* --- Sidebar --- */}
      <aside className="w-64 bg-surface border-r border-background-accent flex flex-col">
        <div className="p-6">
          <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-bold text-blue-500 tracking-tight">
            <PlaySquare className="text-primary" />
            <span>Video<span className="text-primary">Stream</span></span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {navItems.map((item) => (
            <NavLink 
              key={item.to}
              to={item.to} 
              end={item.end}
              className={({ isActive }) => 
                `flex items-center gap-3 p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'bg-primary/10 text-primary border-r-4 border-primary font-bold' 
                    : 'hover:bg-background-secondary text-surface-muted hover:text-white'
                }`
              }
            >
              {item.icon}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* --- Sidebar Footer / Logout --- */}
        <div className="p-4 border-t border-background-accent">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-primary hover:bg-primary/10 rounded-xl transition-all duration-200 font-semibold"
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
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-surface-muted transition-colors group-focus-within:text-primary">
                <Search size={18} />
              </span>
              <input 
                type="text"
                placeholder="Search videos..."
                className="input-field pl-10 rounded-full bg-background border-none h-10 shadow-inner w-full focus:ring-2 focus:ring-primary/50 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          {/* --- User Profile Section --- */}
          <div className="flex items-center gap-4 ml-4">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] text-surface-muted uppercase font-bold tracking-widest">Logged in as</p>
              <p className="text-sm font-medium">{user?.firstName || 'User'}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30 shadow-lg text-primary font-bold text-sm">
              {user?.email?.substring(0, 2).toUpperCase() || 'VS'}
            </div>
          </div>
        </header>

        {/* --- Main Content Outlet --- */}
        <main className="flex-1 overflow-y-auto p-8 bg-background custom-scrollbar">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;