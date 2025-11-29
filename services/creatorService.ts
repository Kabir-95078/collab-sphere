import { Creator, Platform, CreatorLevel } from '../types';
import { MOCK_CREATORS } from '../constants';

const NICHES = [
  'Tech & Gadgets', 'Gaming', 'Beauty & Makeup', 'Fitness & Health', 
  'Travel', 'Food & Culinary', 'Finance & Crypto', 'Fashion', 
  'Lifestyle', 'Education', 'Comedy', 'DIY & Crafts'
];

const PLATFORMS = [Platform.YOUTUBE, Platform.INSTAGRAM, Platform.TIKTOK];

// Helper to generate random creator stats
const getRandomElement = (arr: any[]) => arr[Math.floor(Math.random() * arr.length)];

const generateSubscribers = () => {
  const num = Math.random();
  if (num > 0.95) return (Math.random() * 5 + 1).toFixed(1) + 'M'; // 5% chance of millions
  if (num > 0.6) return Math.floor(Math.random() * 900 + 100) + 'K'; // 100k - 900k
  return Math.floor(Math.random() * 90 + 5) + 'K'; // 5k - 95k
};

const generateFee = (subString: string) => {
  let multiplier = 100;
  if (subString.includes('M')) multiplier = 5000;
  else if (subString.includes('K')) {
    const val = parseInt(subString);
    if (val > 500) multiplier = 2000;
    else if (val > 100) multiplier = 1000;
    else multiplier = 300;
  }
  
  // Random variance +/- 20%
  const base = multiplier + (Math.random() * multiplier * 0.4 - multiplier * 0.2);
  return Math.floor(base / 50) * 50; // Round to nearest 50
};

const generateTags = (niche: string) => {
  const baseTags: Record<string, string[]> = {
    'Tech & Gadgets': ['Reviews', 'Unboxing', 'Apple', 'Android', 'Setup'],
    'Gaming': ['Minecraft', 'FPS', 'Streamer', 'Esports', 'Walkthrough'],
    'Beauty & Makeup': ['Tutorial', 'GRWM', 'Skincare', 'Haul'],
    'Fitness & Health': ['Workout', 'Nutrition', 'Yoga', 'Weightloss'],
    'Travel': ['Vlog', 'Adventure', 'Cinematic', 'Nomad'],
    'Food & Culinary': ['Recipes', 'StreetFood', 'Baking', 'Vegan'],
    'Finance & Crypto': ['Investing', 'Bitcoin', 'Stocks', 'Business'],
    'Fashion': ['OOTD', 'Style', 'Streetwear', 'Thrift'],
    'Lifestyle': ['Vlog', 'Routine', 'Motivation', 'Family'],
    'Education': ['Science', 'History', 'Math', 'Coding'],
    'Comedy': ['Skits', 'Pranks', 'Funny', 'Parody'],
    'DIY & Crafts': ['Art', 'HomeDecor', 'Woodworking', 'Tutorial']
  };
  
  const tags = baseTags[niche] || ['Creator', 'Viral', 'Content'];
  // Return 2-3 random tags from the niche
  return tags.sort(() => 0.5 - Math.random()).slice(0, Math.floor(Math.random() * 2) + 2);
};

export const fetchCreators = async (count: number = 12): Promise<Creator[]> => {
  try {
    const response = await fetch(`https://randomuser.me/api/?results=${count}&inc=name,picture,login,location`);
    const data = await response.json();

    const newCreators: Creator[] = data.results.map((user: any) => {
      const niche = getRandomElement(NICHES);
      const subs = generateSubscribers();
      
      return {
        id: user.login.uuid,
        name: `${user.name.first} ${user.name.last}`,
        handle: `@${user.login.username}`,
        platform: getRandomElement(PLATFORMS),
        subscribers: subs,
        niche: niche,
        bio: `Content creator based in ${user.location.city}, ${user.location.country}. Passionate about ${niche.toLowerCase()} and building community.`,
        avatarUrl: user.picture.large,
        tags: generateTags(niche),
        collabFee: generateFee(subs)
      };
    });

    return newCreators;
  } catch (error) {
    console.error("Failed to fetch creators:", error);
    // Fallback to mocks if API fails, but randomize IDs to avoid key conflicts if called multiple times
    return MOCK_CREATORS.map(c => ({...c, id: Math.random().toString(36).substr(2, 9)}));
  }
};
