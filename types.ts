

export enum Platform {
  YOUTUBE = 'YouTube',
  INSTAGRAM = 'Instagram',
  TIKTOK = 'TikTok'
}

export enum CreatorLevel {
  NEWBIE = 'Newbie',   // 5k - 10k
  JUNIOR = 'Junior',   // 10k - 50k
  SENIOR = 'Senior',   // 50k - 250k
  EXPERT = 'Expert',   // 250k - 1M
  MASTER = 'Master'    // > 1M
}

export interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: Platform;
  subscribers: string; // Display string e.g., "1.2M"
  niche: string;
  bio: string;
  avatarUrl: string;
  tags: string[];
  collabFee: number; // New field for collaboration fee
}

export interface CollabIdea {
  title: string;
  description: string;
  viralPotential: number; // 1-100
}

export interface CollabStrategyResponse {
  pitch: string;
  ideas: CollabIdea[];
  compatibilityScore: number;
  reasoning: string;
}

// Creative Studio Types
export interface ScriptSection {
  heading: string;
  content: string;
  duration: string;
}

export interface ScriptResponse {
  title: string;
  hook: string;
  sections: ScriptSection[];
  callToAction: string;
  estimatedDuration: string;
}

export interface ThumbnailConcept {
  conceptName: string;
  visualDescription: string;
  textOverlay: string;
  colorVibe: string;
  whyItWorks: string;
}

// Community Hub Types
export interface ForumPost {
  id: string;
  authorId: string;
  authorName: string;
  authorAvatar: string;
  title: string;
  content: string;
  likes: number;
  comments: number;
  tags: string[];
  timestamp: string;
  isTrending?: boolean;
}

// Social Feed Types
export interface FeedPost {
  id: string;
  authorId: string;
  authorName: string;
  authorHandle: string;
  authorAvatar: string;
  content: string;
  imageUrl?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked?: boolean;
}

// Freelance Types
export enum JobType {
  EDITING = 'Video Editing',
  DESIGN = 'Thumbnail Design',
  SCRIPT = 'Scriptwriting',
  MANAGEMENT = 'Channel Management',
  AUDIO = 'Audio Engineering'
}

export interface FreelanceJob {
  id: string;
  clientId: string;
  clientName: string;
  clientAvatar: string;
  title: string;
  description: string;
  budget: string; // e.g. "$500 - $1k"
  type: JobType;
  deadline: string;
  tags: string[];
  postedAt: string;
}

// User & Admin Types
export type UserRole = 'user' | 'admin';

export interface UserProfile {
  name: string;
  email: string;
  role: UserRole;
  bio?: string;
  avatarUrl?: string;
  handle?: string;
  platform?: string;
  subscribers?: string;
  joinedAt?: string;
}

export interface SystemAnalytics {
  totalUsers: number;
  totalPosts: number;
  totalJobs: number;
  totalRevenue: number;
  userGrowth: number[]; // Array for charts
  activeSessions: number;
}