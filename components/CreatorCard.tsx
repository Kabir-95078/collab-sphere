import React from 'react';
import { Creator, Platform } from '../types';
import { getCreatorLevel, getLevelColor, getLevelBg, getLevelIcon } from '../utils/levelUtils';

interface CreatorCardProps {
  creator: Creator;
  onSelect?: (creator: Creator) => void;
  isSelected?: boolean;
}

const CreatorCard: React.FC<CreatorCardProps> = ({ creator, onSelect, isSelected = false }) => {
  const level = getCreatorLevel(creator.subscribers);
  
  const getIcon = (platform: Platform) => {
    switch (platform) {
      case Platform.YOUTUBE: return <i className="fab fa-youtube text-red-500"></i>;
      case Platform.INSTAGRAM: return <i className="fab fa-instagram text-pink-500"></i>;
      case Platform.TIKTOK: return <i className="fab fa-tiktok text-brand-blue"></i>;
      default: return <i className="fas fa-video"></i>;
    }
  };

  // Format fee to K format if > 1000
  const formatFee = (fee: number) => {
    if (fee >= 1000) {
      return `$${(fee / 1000).toFixed(1)}k`;
    }
    return `$${fee}`;
  };

  return (
    <div 
      onClick={() => onSelect && onSelect(creator)}
      className={`
        glass-panel rounded-xl p-5 cursor-pointer transition-all duration-500 transform 
        hover:-translate-y-2 hover:scale-[1.02] hover:shadow-2xl hover:shadow-brand-pink/20 relative overflow-hidden group/card
        ${isSelected ? 'ring-2 ring-brand-pink bg-brand-base' : 'hover:bg-brand-plum/30'}
      `}
    >
      {/* Holographic Shine Effect on Hover */}
      <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover/card:opacity-100 transform -translate-x-full group-hover/card:translate-x-full transition-all duration-1000 pointer-events-none z-0"></div>

      {/* Level Badge - Positioned inside to avoid clipping */}
      <div className={`
        absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-bold border shadow-lg 
        uppercase tracking-wide flex items-center gap-1.5 backdrop-blur-md z-20
        ${getLevelBg(level)} bg-opacity-20 ${getLevelColor(level)}
      `}>
         <i className={`fas ${getLevelIcon(level)}`}></i>
         {level}
      </div>

      <div className="flex items-start gap-4 mt-1 relative z-10">
        <img 
          src={creator.avatarUrl} 
          alt={creator.name} 
          className="w-16 h-16 rounded-full object-cover border-2 border-brand-plum shadow-lg group-hover/card:border-brand-pink transition-colors duration-300"
        />
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            {/* Add right padding to prevent text from going under the badge */}
            <h3 className="font-bold text-lg truncate text-white group-hover/card:text-brand-pink transition-colors pr-24">
              {creator.name}
            </h3>
          </div>
          <div className="flex items-center gap-2 mb-1">
             <p className="text-sm text-brand-blue truncate">{creator.handle}</p>
             <span className="text-sm opacity-80">{getIcon(creator.platform)}</span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-xs bg-brand-base text-brand-blue border border-brand-plum px-2 py-0.5 rounded-full">
              {creator.subscribers} Subs
            </span>
            <span className="text-xs bg-brand-deep text-gray-300 px-2 py-0.5 rounded-full truncate max-w-[80px]">
              {creator.niche}
            </span>
          </div>
        </div>
      </div>
      
      <p className="mt-4 text-sm text-gray-300 line-clamp-2 h-10 relative z-10">
        {creator.bio}
      </p>

      <div className="mt-4 flex items-end justify-between relative z-10">
        <div className="flex flex-wrap gap-1 w-2/3">
            {creator.tags.slice(0, 2).map(tag => (
            <span key={tag} className="text-[10px] text-gray-500 bg-brand-deep/50 px-1.5 py-0.5 rounded">#{tag}</span>
            ))}
        </div>
        
        {/* Collab Fee Display */}
        <div className="flex flex-col items-end">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Starting at</span>
            <span className="text-lg font-bold text-white bg-clip-text text-transparent bg-gradient-to-r from-brand-blue to-white">
                {formatFee(creator.collabFee)}
            </span>
        </div>
      </div>
    </div>
  );
};

export default CreatorCard;