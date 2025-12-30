
import React, { useState } from 'react';
import { LayoutDashboard, Rocket, BarChart3, Settings, Menu, Bell, X, Zap } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

const SidebarItem = ({ icon: Icon, label, path, active, onClick }: any) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    navigate(path);
    if (onClick) onClick();
  };

  return (
    <button
      onClick={handleClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 text-left ${
        active 
          ? 'bg-astro-accent/20 text-astro-accent border-r-2 border-astro-accent' 
          : 'text-astro-500 hover:bg-astro-800 hover:text-gray-200'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );
};

export default function Layout({ children }: { children?: React.ReactNode }) {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const isActive = (p: string) => location.pathname === p;

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="flex h-screen bg-astro-900 overflow-hidden relative">
      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-20 md:hidden backdrop-blur-sm"
          onClick={closeMobileMenu}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed md:static inset-y-0 left-0 z-30 w-64 bg-astro-950 border-r border-astro-800 flex flex-col transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="p-1.5 bg-astro-accent rounded-lg">
                <Zap size={20} className="text-white fill-current" />
            </div>
            <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
                  NovaMedia
                </h1>
                <p className="text-[10px] text-astro-500 uppercase tracking-[0.2em]">Autonomous Pro</p>
            </div>
          </div>
          {/* Close button for mobile */}
          <button onClick={closeMobileMenu} className="md:hidden text-astro-500 hover:text-white">
            <X size={24} />
          </button>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <SidebarItem icon={LayoutDashboard} label="Dashboard" path="/" active={isActive('/')} onClick={closeMobileMenu} />
          <SidebarItem icon={Rocket} label="Campaigns" path="/campaigns" active={isActive('/campaigns')} onClick={closeMobileMenu} />
          <SidebarItem icon={BarChart3} label="Analytics" path="/analytics" active={isActive('/analytics')} onClick={closeMobileMenu} />
          <SidebarItem icon={Settings} label="Settings" path="/settings" active={isActive('/settings')} onClick={closeMobileMenu} />
        </nav>

        <div className="p-4 border-t border-astro-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-astro-accent flex items-center justify-center text-white font-bold">
              NM
            </div>
            <div>
              <p className="text-sm font-medium text-white">Admin Nova</p>
              <p className="text-xs text-astro-500">admin@novamedia.ai</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-astro-900/50 backdrop-blur-md border-b border-astro-800 flex items-center justify-between px-6 z-10">
          <button 
            className="md:hidden text-astro-400 hover:text-white"
            onClick={toggleMobileMenu}
          >
            <Menu size={24} />
          </button>
          
          <div className="flex items-center gap-4 ml-auto">
             <div className="bg-astro-800 px-3 py-1 rounded-full border border-astro-700 hidden sm:flex items-center">
                <span className="text-[10px] text-astro-400 mr-2 tracking-tighter">n8n BRIDGE</span>
                <span className="text-[10px] text-emerald-400 font-bold">ACTIVE ●</span>
             </div>
            <button className="text-astro-400 hover:text-white relative p-2">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-astro-900"></span>
            </button>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-6 scroll-smooth">
          {children}
        </main>
      </div>
    </div>
  );
}
