import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'discover', label: 'Discover', icon: 'fa-compass' },
    { id: 'matchmaker', label: 'AI Matchmaker', icon: 'fa-wand-magic-sparkles' },
    { id: 'profile', label: 'My Profile', icon: 'fa-user' },
  ];

  return (
    <aside className="fixed bottom-0 left-0 w-full z-50 bg-brand-deep border-t border-brand-base md:relative md:w-64 md:h-screen md:border-t-0 md:border-r flex md:flex-col justify-between p-2 md:p-6">
      <div className="flex-1 flex md:flex-col justify-around md:justify-start gap-2 md:gap-6">
        <div className="hidden md:flex items-center gap-3 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-pink to-brand-plum flex items-center justify-center shadow-lg shadow-brand-pink/20">
            <i className="fas fa-network-wired text-white text-sm"></i>
          </div>
          <span className="font-bold text-xl tracking-tight text-white">CollabSphere</span>
        </div>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`
              flex flex-col md:flex-row items-center md:gap-4 p-2 md:px-4 md:py-3 rounded-xl transition-all
              ${activeTab === item.id 
                ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20' 
                : 'text-gray-400 hover:text-white hover:bg-brand-base/50'}
            `}
          >
            <i className={`fas ${item.icon} text-lg md:text-xl mb-1 md:mb-0`}></i>
            <span className="text-xs md:text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </div>
      
      <div className="hidden md:block px-4">
         <div className="p-4 rounded-xl bg-gradient-to-br from-brand-base to-brand-deep border border-brand-plum/30">
            <p className="text-xs text-gray-400 mb-2">Pro Plan</p>
            <div className="w-full bg-brand-deep h-1.5 rounded-full overflow-hidden mb-2">
              <div className="bg-brand-blue w-3/4 h-full"></div>
            </div>
            <p className="text-xs text-gray-400">12/15 AI Credits Used</p>
         </div>
      </div>
    </aside>
  );
};

export default Sidebar;