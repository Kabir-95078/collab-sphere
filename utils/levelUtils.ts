
import { CreatorLevel } from '../types';

export const parseSubscribers = (subString: string): number => {
  const clean = subString.toUpperCase().replace(/,/g, '');
  if (clean.includes('M')) {
    return parseFloat(clean.replace('M', '')) * 1_000_000;
  }
  if (clean.includes('K')) {
    return parseFloat(clean.replace('K', '')) * 1_000;
  }
  return parseFloat(clean) || 0;
};

export const getCreatorLevel = (subscribers: string): CreatorLevel => {
  const count = parseSubscribers(subscribers);
  
  if (count >= 1_000_000) return CreatorLevel.MASTER;
  if (count >= 250_000) return CreatorLevel.EXPERT;
  if (count >= 50_000) return CreatorLevel.SENIOR;
  if (count >= 10_000) return CreatorLevel.JUNIOR;
  return CreatorLevel.NEWBIE;
};

export const getNextLevelThreshold = (currentLevel: CreatorLevel): number => {
  switch (currentLevel) {
    case CreatorLevel.NEWBIE: return 10_000;
    case CreatorLevel.JUNIOR: return 50_000;
    case CreatorLevel.SENIOR: return 250_000;
    case CreatorLevel.EXPERT: return 1_000_000;
    case CreatorLevel.MASTER: return 10_000_000; // Arbitrary cap for master
    default: return 10_000;
  }
};

export const getLevelColor = (level: CreatorLevel): string => {
  switch (level) {
    case CreatorLevel.MASTER: return 'text-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)]';
    case CreatorLevel.EXPERT: return 'text-purple-400 border-purple-400 shadow-[0_0_10px_rgba(192,132,252,0.4)]';
    case CreatorLevel.SENIOR: return 'text-brand-pink border-brand-pink';
    case CreatorLevel.JUNIOR: return 'text-brand-blue border-brand-blue';
    case CreatorLevel.NEWBIE: return 'text-gray-400 border-gray-400';
    default: return 'text-gray-400';
  }
};

export const getLevelBg = (level: CreatorLevel): string => {
  switch (level) {
    case CreatorLevel.MASTER: return 'bg-yellow-400';
    case CreatorLevel.EXPERT: return 'bg-purple-500';
    case CreatorLevel.SENIOR: return 'bg-brand-pink';
    case CreatorLevel.JUNIOR: return 'bg-brand-blue';
    case CreatorLevel.NEWBIE: return 'bg-gray-500';
    default: return 'bg-gray-500';
  }
};

export const getLevelIcon = (level: CreatorLevel): string => {
  switch (level) {
    case CreatorLevel.MASTER: return 'fa-gem';
    case CreatorLevel.EXPERT: return 'fa-crown';
    case CreatorLevel.SENIOR: return 'fa-medal';
    case CreatorLevel.JUNIOR: return 'fa-shield-alt';
    case CreatorLevel.NEWBIE: return 'fa-user-astronaut';
    default: return 'fa-user';
  }
};

export const getLevelPerks = (level: CreatorLevel): string[] => {
  switch (level) {
    case CreatorLevel.NEWBIE: 
      return ['Basic Discovery Access', 'Community Hub Access', 'Standard Support'];
    case CreatorLevel.JUNIOR: 
      return ['5 Free AI Credits/mo', 'Bronze Profile Badge', 'Freelance Job Posting'];
    case CreatorLevel.SENIOR: 
      return ['15 Free AI Credits/mo', 'Silver Profile Badge', '10% Fee Discount', 'Priority Support'];
    case CreatorLevel.EXPERT: 
      return ['50 Free AI Credits/mo', 'Gold Profile Badge', 'Featured on Discovery', '5% Fee Discount'];
    case CreatorLevel.MASTER: 
      return ['Unlimited AI Credits', 'Diamond Badge', '0% Platform Fees', 'Dedicated Account Manager', 'Verified Status'];
    default: 
      return [];
  }
};
