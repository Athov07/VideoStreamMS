import React, { useState } from 'react';
import { Outlet, Link, NavLink, useNavigate } from 'react-router-dom';

const DashboardLayout = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <div className="flex h-screen bg-background text-surface-text font-sans">
      {/* --- Sidebar (Using your Surface color) --- */}
      <aside className="w-64 bg-surface border-r border-background-accent flex flex-col">
        <div className="p-6">
          <Link to="/dashboard" className="text-2xl font-bold text-blue-500 tracking-tight">
            Video<span className="text-primary">Stream</span>
          </Link>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          <NavLink 
            to="/dashboard" 
            end
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-md transition-all ${isActive ? 'bg-background-accent text-white' : 'hover:bg-background-secondary text-surface-muted'}`
            }
          >
            Home
          </NavLink>
          <NavLink 
            to="/dashboard/my-videos" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-md transition-all ${isActive ? 'bg-background-accent text-white' : 'hover:bg-background-secondary text-surface-muted'}`
            }
          >
            My Videos
          </NavLink>
          <NavLink 
            to="/dashboard/profile" 
            className={({ isActive }) => 
              `flex items-center gap-3 p-3 rounded-md transition-all ${isActive ? 'bg-background-accent text-white' : 'hover:bg-background-secondary text-surface-muted'}`
            }
          >
            Profile
          </NavLink>
        </nav>

        <div className="p-4 border-t border-background-accent">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 p-3 text-primary hover:bg-primary/10 rounded-md transition-colors"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* --- Main Content Area --- */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* --- Navbar (Using your Background Secondary) --- */}
        <header className="h-16 border-b border-background-accent flex items-center justify-between px-8 bg-background-secondary/80 backdrop-blur-md">
          <div className="flex-1 max-w-xl">
            <div className="relative group">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-surface-muted">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
                </svg>
              </span>
              {/* Using your custom .input-field class */}
              <input 
                type="text"
                placeholder="Search videos..."
                className="input-field pl-10 rounded-full bg-background border-none h-10 shadow-inner"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex items-center gap-4 ml-4">
            <div className="text-right">
              <p className="text-xs text-surface-muted">Logged in as</p>
              <p className="text-sm font-medium">Developer</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-background-accent flex items-center justify-center border border-background-accent shadow-lg text-primary font-bold">
              JS
            </div>
          </div>
        </header>

        {/* --- Outlet for Child Pages --- */}
        <main className="flex-1 overflow-y-auto p-8 bg-background">
          <Outlet context={{ searchQuery }} />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;