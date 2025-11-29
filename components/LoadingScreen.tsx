import React, { useState, useEffect } from 'react';

interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [messageIndex, setMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const messages = [
    "Initializing Neural Core...",
    "Scanning Creator Universe...",
    "Calibrating Match Algorithms...",
    "Synthesizing Data Streams...",
    "Launch Sequence Initiated..."
  ];

  useEffect(() => {
    // Message cycling - faster
    const messageInterval = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messages.length);
    }, 400);

    // Progress bar simulation - Significantly faster
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          clearInterval(messageInterval);
          setTimeout(onComplete, 200); // Quick pause at 100%
          return 100;
        }
        // Much faster increments
        const increment = Math.random() * 5 + 2; 
        return Math.min(100, prev + increment);
      });
    }, 30);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-brand-deep flex flex-col items-center justify-center overflow-hidden">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-pink/10 rounded-full blur-[100px] animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-blue/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
        
        {/* Floating Particles */}
        {[...Array(15)].map((_, i) => (
            <div 
                key={i}
                className="absolute rounded-full bg-white/20 animate-float"
                style={{
                    width: Math.random() * 4 + 1 + 'px',
                    height: Math.random() * 4 + 1 + 'px',
                    top: Math.random() * 100 + '%',
                    left: Math.random() * 100 + '%',
                    animationDuration: (Math.random() * 5 + 5) + 's', // Faster particles
                    animationDelay: (Math.random() * 2) + 's'
                }}
            ></div>
        ))}
      </div>

      <div className="relative z-10 flex flex-col items-center">
        
        {/* 3D Holographic Core */}
        <div className="relative w-48 h-48 mb-16 flex items-center justify-center perspective-1000">
           
           {/* Outer Ring X */}
           <div className="absolute inset-0 border-2 border-brand-pink/30 rounded-full animate-spin-3d-x shadow-[0_0_15px_rgba(196,30,93,0.3)]"></div>
           
           {/* Outer Ring Y */}
           <div className="absolute inset-2 border-2 border-brand-blue/30 rounded-full animate-spin-3d-y shadow-[0_0_15px_rgba(105,179,216,0.3)]"></div>
           
           {/* Middle Ring Static/Slow */}
           <div className="absolute inset-8 border border-white/10 rounded-full animate-spin-slow border-dashed"></div>

           {/* Core */}
           <div className="relative w-16 h-16 bg-gradient-to-br from-brand-pink to-brand-plum rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(196,30,93,0.8)] animate-pulse-glow z-20">
              <i className="fas fa-network-wired text-white text-2xl animate-spin-reverse-slow"></i>
           </div>
           
           {/* Scanning Effect */}
           <div className="absolute inset-0 rounded-full border-t-2 border-transparent border-l-2 border-brand-blue/50 opacity-50 animate-spin"></div>
        </div>

        {/* Text Area */}
        <div className="w-80 text-center h-16 relative">
             <h2 
               key={messageIndex} // Key forces re-render for animation
               className="text-lg font-mono font-medium text-brand-blue tracking-wider animate-text-cycle absolute w-full left-0 top-0"
             >
                {messages[messageIndex]}
             </h2>
        </div>
        
        {/* Smooth Progress Bar */}
        <div className="w-64 md:w-80 h-1.5 bg-brand-deep border border-brand-base rounded-full overflow-hidden relative shadow-lg">
          <div 
            className="h-full bg-gradient-to-r from-brand-pink via-brand-plum to-brand-blue relative"
            style={{ 
                width: `${progress}%`,
                transition: 'width 0.1s linear' // Smoother transition
            }}
          >
             {/* Glint effect on bar */}
             <div className="absolute top-0 right-0 bottom-0 w-20 bg-gradient-to-r from-transparent via-white/50 to-transparent transform skew-x-12 translate-x-10 animate-[shimmer_2s_infinite]"></div>
          </div>
        </div>
        
        <div className="mt-2 flex justify-between w-64 md:w-80 text-[10px] text-gray-500 font-mono uppercase">
            <span>System Status: Optimal</span>
            <span>{Math.round(progress)}%</span>
        </div>

      </div>
    </div>
  );
};

export default LoadingScreen;