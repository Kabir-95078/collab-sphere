

import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Dashboard from './views/Dashboard';
import Discover from './views/Discover';
import Matchmaker from './views/Matchmaker';
import AuthPage from './components/AuthPage';
import SplashScreen from './components/SplashScreen';
import LoadingScreen from './components/LoadingScreen';
import Profile from './views/Profile';
import CommunityHub from './views/CommunityHub';
import Freelance from './views/Freelance';
import Feed from './views/Feed';
import CreativeStudio from './views/CreativeStudio'; 
import Chatbot from './components/Chatbot';
import AdminPanel from './views/AdminPanel'; // New Import
import { Creator } from './types';
import { initDatabase } from './services/backendService';

type AppStage = 'SPLASH' | 'AUTH' | 'LOADING' | 'DASHBOARD';

const App: React.FC = () => {
  const [appStage, setAppStage] = useState<AppStage>('SPLASH');
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedCollabTarget, setSelectedCollabTarget] = useState<Creator | undefined>(undefined);
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');

  // Initialize Backend Simulation
  useEffect(() => {
    initDatabase();
  }, []);

  const handleCollabRequest = (creator: Creator) => {
    setSelectedCollabTarget(creator);
    setActiveTab('matchmaker');
  };

  const handleLogout = () => {
    localStorage.removeItem('collabsphere_active_user');
    setAppStage('AUTH');
    setActiveTab('dashboard');
    setSelectedCollabTarget(undefined);
    setGlobalSearchTerm('');
  };

  const handleGlobalSearch = (term: string) => {
    setGlobalSearchTerm(term);
    if (term && activeTab !== 'discover') {
      setActiveTab('discover');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'creative-studio':
        return <CreativeStudio />;
      case 'feed':
        return <Feed />;
      case 'discover':
        return <Discover 
                 onCollabRequest={handleCollabRequest} 
                 searchTerm={globalSearchTerm}
                 setSearchTerm={handleGlobalSearch}
               />;
      case 'community':
        return <CommunityHub />;
      case 'freelance':
        return <Freelance />;
      case 'matchmaker':
        return <Matchmaker initialTarget={selectedCollabTarget} />;
      case 'profile':
        return <Profile onLogout={handleLogout} />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <Dashboard />;
    }
  };

  if (appStage === 'SPLASH') {
    return (
      <>
        <div className="noise-overlay"></div>
        <SplashScreen onComplete={() => setAppStage('AUTH')} />
      </>
    );
  }

  if (appStage === 'AUTH') {
    return (
      <>
        <div className="noise-overlay"></div>
        <AuthPage onLogin={() => setAppStage('LOADING')} />
      </>
    );
  }

  if (appStage === 'LOADING') {
    return (
      <>
        <div className="noise-overlay"></div>
        <LoadingScreen onComplete={() => setAppStage('DASHBOARD')} />
      </>
    );
  }

  return (
    <div className="flex flex-col min-h-screen w-full bg-brand-deep overflow-hidden animate-[fadeIn_0.5s_ease-out]">
      <div className="noise-overlay"></div>
      
      <Header 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout} 
        searchTerm={globalSearchTerm}
        onSearch={handleGlobalSearch}
      />
      
      <main className="flex-1 h-screen overflow-hidden relative pt-20">
        
        {/* Background Gradients - Global for Dashboard - VIVID ANIMATIONS */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-brand-pink/25 rounded-full blur-[90px] animate-float-large"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-brand-plum/30 rounded-full blur-[90px] animate-float-delayed"></div>
          <div className="absolute top-[40%] right-[30%] w-[30%] h-[30%] bg-brand-base/20 rounded-full blur-[70px] animate-float-slow"></div>
          
          <div className="absolute bottom-[20%] left-[20%] w-[15%] h-[15%] bg-brand-blue/10 rounded-full blur-[50px] animate-pulse-glow"></div>
          
          <div className="absolute w-2 h-2 bg-white rounded-full blur-[2px] shadow-[0_0_15px_white] animate-drift" style={{ top: '80%', left: '-10%', animationDuration: '15s' }}></div>
          <div className="absolute w-1.5 h-1.5 bg-brand-blue rounded-full blur-[1px] shadow-[0_0_10px_#69B3D8] animate-drift" style={{ top: '60%', left: '-10%', animationDelay: '5s', animationDuration: '20s' }}></div>
          <div className="absolute w-3 h-3 bg-brand-pink rounded-full blur-[3px] shadow-[0_0_20px_#C41E5D] animate-drift" style={{ top: '30%', left: '-10%', animationDelay: '10s', animationDuration: '25s' }}></div>
        </div>

        <div className="relative z-10 h-full overflow-y-auto custom-scrollbar">
           {renderContent()}
        </div>

        <Chatbot />
      </main>
    </div>
  );
};

export default App;