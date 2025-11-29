import React, { useState, useEffect } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Normalize mouse position from -1 to 1
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      setMousePos({ x, y });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onComplete, 800); // Wait for exit animation
  };

  return (
    <div className={`fixed inset-0 z-[100] bg-brand-deep overflow-hidden flex items-center justify-center transition-opacity duration-700 ${isExiting ? 'opacity-0 scale-110 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Interactive Background Layers */}
      <div 
        className="absolute inset-0 opacity-30 transition-transform duration-100 ease-out"
        style={{ transform: `translate(${mousePos.x * -20}px, ${mousePos.y * -20}px)` }}
      >
        <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-brand-pink rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[20%] right-[20%] w-80 h-80 bg-brand-plum rounded-full blur-[120px]"></div>
      </div>

      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '50px 50px',
            transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`
        }}
      ></div>

      {/* Center Content */}
      <div className="relative z-10 text-center p-8">
        <div 
            className="mb-8 relative inline-block animate-breathing"
            style={{ transform: `translate(${mousePos.x * 10}px, ${mousePos.y * 10}px)` }}
        >
          <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-brand-pink to-brand-plum mx-auto flex items-center justify-center shadow-[0_0_50px_rgba(196,30,93,0.5)] transform rotate-12">
             <i className="fas fa-network-wired text-white text-4xl transform -rotate-12"></i>
          </div>
        </div>

        <h1 className="text-5xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-200 to-gray-400 mb-6 tracking-tight">
          CollabSphere
        </h1>
        
        <p className="text-gray-400 text-lg md:text-xl mb-12 max-w-lg mx-auto leading-relaxed">
          Connect with creators. Unlock synergies. <br/>
          <span className="text-brand-blue font-medium">Powered by Gemini AI.</span>
        </p>

        <button
          onClick={handleEnter}
          className="group relative px-8 py-4 bg-white text-brand-deep font-bold rounded-full overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)]"
        >
          <span className="relative z-10 flex items-center gap-2">
            Enter Platform <i className="fas fa-arrow-right group-hover:translate-x-1 transition-transform"></i>
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-brand-pink opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </button>
      </div>
      
      <div className="absolute bottom-8 text-gray-600 text-xs tracking-widest uppercase">
         Interactive Experience
      </div>
    </div>
  );
};

export default SplashScreen;