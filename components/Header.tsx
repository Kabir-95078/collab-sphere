

import React, { useState, useEffect, useRef } from 'react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onLogout: () => void;
  searchTerm?: string;
  onSearch?: (term: string) => void;
}

const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onLogout, searchTerm = '', onSearch }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userAvatar, setUserAvatar] = useState<string>('');
  const [userName, setUserName] = useState<string>('');
  const [userRole, setUserRole] = useState<string>('user');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load user info for the avatar
    const storedUser = localStorage.getItem('collabsphere_active_user');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setUserName(user.name);
      setUserRole(user.role || 'user');
      // Generate avatar if none exists
      setUserAvatar(user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=C41E5D&color=fff&size=128`);
    } else {
        setUserName("Guest");
        setUserAvatar(`https://ui-avatars.com/api/?name=Guest&background=333&color=fff&size=128`);
    }

    // Click outside to close
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-pie' },
    { id: 'creative-studio', label: 'Creative Studio', icon: 'fa-pencil-ruler' },
    { id: 'feed', label: 'Social Feed', icon: 'fa-stream' },
    { id: 'discover', label: 'Discover', icon: 'fa-compass' },
    { id: 'community', label: 'Community Hub', icon: 'fa-users' },
    { id: 'freelance', label: 'Freelance', icon: 'fa-briefcase' },
    { id: 'matchmaker', label: 'AI Matchmaker', icon: 'fa-wand-magic-sparkles' },
    { id: 'profile', label: 'My Profile', icon: 'fa-user' },
  ];

  // Insert Admin Panel if role is admin
  const displayItems = userRole === 'admin' 
    ? [{ id: 'admin', label: 'Admin Panel', icon: 'fa-shield-alt text-red-500' }, ...menuItems]
    : menuItems;

  const handleNav = (id: string) => {
    setActiveTab(id);
    setIsOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 w-full h-20 z-50 px-4 md:px-6 flex items-center justify-between bg-brand-deep/90 backdrop-blur-md border-b border-brand-base transition-all">
      
      {/* Left Group: Profile & Logo */}
      <div className="flex items-center gap-4">
          
          {/* Profile Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-3 p-1.5 pr-4 rounded-full transition-all duration-300 group
                    ${isOpen ? 'bg-brand-base ring-2 ring-brand-pink shadow-lg shadow-brand-pink/20' : 'hover:bg-brand-base/50 hover:scale-105 active:scale-95'}
                `}
            >
                <div className="relative">
                    <img 
                        src={userAvatar} 
                        alt="Profile" 
                        className={`w-10 h-10 rounded-full object-cover border-2 transition-colors duration-300 ${isOpen ? 'border-brand-pink' : 'border-brand-plum group-hover:border-brand-pink'}`} 
                    />
                    <div className={`absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-brand-deep rounded-full ${isOpen ? 'animate-pulse' : ''}`}></div>
                </div>
                <div className="hidden lg:flex flex-col items-start">
                    <span className="text-xs text-gray-400 font-medium uppercase tracking-wider">Menu</span>
                    <span className="text-sm text-white font-bold leading-none group-hover:text-brand-pink transition-colors">
                        {userName.split(' ')[0]}
                    </span>
                </div>
                <i className={`fas fa-chevron-down text-gray-400 text-xs ml-1 transition-transform duration-300 ${isOpen ? 'rotate-180 text-brand-pink' : ''}`}></i>
            </button>

            {/* Animated Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-16 left-0 w-64 bg-brand-deep/95 backdrop-blur-xl border border-brand-base rounded-2xl shadow-2xl overflow-hidden animate-[fadeInUp_0.3s_ease-out] origin-top-left z-50">
                    <div className="p-2 space-y-1">
                        <div className="px-4 py-3 border-b border-brand-base/50 mb-1 flex justify-between items-center">
                            <p className="text-xs text-gray-500 uppercase tracking-widest">Navigation</p>
                            {userRole === 'admin' && <span className="text-[10px] bg-red-600 text-white px-1.5 rounded">ADMIN</span>}
                        </div>
                        
                        {displayItems.map(item => (
                            <button
                                key={item.id}
                                onClick={() => handleNav(item.id)}
                                className={`
                                    w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left transition-all duration-200 group relative overflow-hidden
                                    ${activeTab === item.id 
                                        ? 'bg-gradient-to-r from-brand-base to-transparent text-white font-semibold' 
                                        : 'text-gray-300 hover:bg-brand-base/30 hover:text-white hover:pl-6'}
                                `}
                            >
                                <div className={`
                                    w-8 h-8 rounded-lg flex items-center justify-center transition-colors
                                    ${activeTab === item.id ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/30' : 'bg-brand-deep border border-brand-base text-gray-400 group-hover:border-brand-pink/50 group-hover:text-brand-pink'}
                                `}>
                                    <i className={`fas ${item.icon} text-sm`}></i>
                                </div>
                                <span>{item.label}</span>
                                {activeTab === item.id && (
                                    <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-brand-pink rounded-l-full shadow-[0_0_10px_#C41E5D]"></div>
                                )}
                            </button>
                        ))}
                        
                        <div className="h-px bg-brand-base/50 my-2 mx-4"></div>
                        
                        <button 
                            onClick={onLogout}
                            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-left text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors hover:pl-6"
                        >
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                                <i className="fas fa-sign-out-alt text-sm"></i>
                            </div>
                            <span>Log Out</span>
                        </button>
                    </div>
                </div>
            )}
          </div>

          {/* Brand Logo - Visible next to profile on Desktop */}
          <div className="hidden md:flex items-center gap-2">
             <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-pink to-brand-plum flex items-center justify-center shadow-lg shadow-brand-pink/20 animate-pulse-glow">
                <i className="fas fa-network-wired text-white text-xs"></i>
             </div>
             <span className="font-bold text-lg tracking-tight text-white hidden xl:block">
                CollabSphere
             </span>
          </div>

      </div>

      {/* Center: Global Search Bar - Animated */}
      <div className={`flex-1 mx-4 lg:mx-12 transition-all duration-500 ease-out ${isSearchFocused ? 'max-w-3xl' : 'max-w-xl'}`}>
        <div className={`relative group transition-all duration-300 transform ${isSearchFocused ? 'scale-[1.02]' : ''}`}>
           <i className={`fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors ${isSearchFocused ? 'text-brand-pink' : 'text-gray-500'}`}></i>
           <input 
              type="text" 
              placeholder="Find creators, jobs, or community posts..." 
              value={searchTerm}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              onChange={(e) => onSearch && onSearch(e.target.value)}
              className={`
                w-full bg-brand-deep border rounded-full py-2.5 pl-11 pr-4 text-sm text-white placeholder-gray-500 
                focus:outline-none focus:ring-2 focus:ring-brand-pink focus:border-transparent transition-all shadow-inner
                ${isSearchFocused ? 'border-brand-pink shadow-[0_0_15px_rgba(196,30,93,0.3)]' : 'border-brand-base'}
              `}
           />
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Credits</span>
            <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></div>
                <span className="text-sm font-mono font-bold text-brand-blue">12/15</span>
            </div>
        </div>
        <button className="bg-brand-pink hover:bg-brand-plum text-white text-xs font-bold px-4 py-2 rounded-lg shadow-lg shadow-brand-pink/20 transition-all hover:scale-110 active:scale-95 whitespace-nowrap animate-pulse-glow">
           Go Pro
        </button>
      </div>

    </header>
  );
};

export default Header;