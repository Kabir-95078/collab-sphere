import { MOCK_FEED_POSTS, MOCK_FORUM_POSTS, MOCK_JOBS, MOCK_CREATORS } from '../constants';
import { FeedPost, ForumPost, FreelanceJob, Creator, Platform, SystemAnalytics } from '../types';

// Storage Keys
const KEYS = {
  USERS: 'collabsphere_users',
  FEED: 'collabsphere_feed',
  FORUM: 'collabsphere_forum',
  JOBS: 'collabsphere_jobs'
};

// --- DATABASE INITIALIZATION ---
export const initDatabase = () => {
  if (!localStorage.getItem(KEYS.FEED)) {
    localStorage.setItem(KEYS.FEED, JSON.stringify(MOCK_FEED_POSTS));
  }
  if (!localStorage.getItem(KEYS.FORUM)) {
    localStorage.setItem(KEYS.FORUM, JSON.stringify(MOCK_FORUM_POSTS));
  }
  if (!localStorage.getItem(KEYS.JOBS)) {
    localStorage.setItem(KEYS.JOBS, JSON.stringify(MOCK_JOBS));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    // Create a default demo user AND an Admin user
    const users = {
      'demo@collabsphere.ai': {
        name: 'Demo Creator',
        email: 'demo@collabsphere.ai',
        password: 'Password1!',
        role: 'user',
        bio: 'Just exploring the universe of content creation.',
        niche: 'Tech',
        handle: '@democreator',
        platform: 'YouTube',
        subscribers: '10K',
        tags: ['Tech', 'Demo'],
        joinedAt: new Date().toISOString(),
        avatarUrl: 'https://ui-avatars.com/api/?name=Demo+Creator&background=C41E5D&color=fff'
      },
      'admin@collabsphere.ai': {
        name: 'System Admin',
        email: 'admin@collabsphere.ai',
        password: 'Admin123!', // Strict password rules still apply logic-wise, but this is the seed
        role: 'admin',
        bio: 'Platform Administrator',
        handle: '@admin',
        joinedAt: new Date().toISOString(),
        avatarUrl: 'https://ui-avatars.com/api/?name=System+Admin&background=000&color=fff'
      }
    };
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  }
};

// --- AUTHENTICATION ---

export const backendLogin = async (email: string, password: string): Promise<any> => {
  await delay(800); // Simulate network latency
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  const user = users[email];
  
  if (user && user.password === password) {
    const { password, ...safeUser } = user; // Exclude password from return
    return safeUser;
  }
  throw new Error('Invalid email or password');
};

export const backendRegister = async (userData: any): Promise<any> => {
  await delay(800);
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  
  if (users[userData.email]) {
    throw new Error('Email already registered');
  }

  const newUser = {
    ...userData,
    role: 'user', // Default role
    joinedAt: new Date().toISOString(),
    bio: 'Content creator ready to collaborate!',
    niche: 'General',
    handle: '@' + userData.name.replace(/\s+/g, '').toLowerCase(),
    platform: 'YouTube',
    subscribers: '0',
    tags: ['Creator'],
    avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=C41E5D&color=fff`
  };

  users[userData.email] = newUser;
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));

  const { password, ...safeUser } = newUser;
  return safeUser;
};

export const backendUpdateUser = async (email: string, updates: any): Promise<any> => {
  await delay(500);
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  if (!users[email]) throw new Error('User not found');
  
  const updatedUser = { ...users[email], ...updates };
  users[email] = updatedUser;
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  
  const { password, ...safeUser } = updatedUser;
  return safeUser;
};

// --- ANALYTICS (ADMIN) ---

export const getSystemAnalytics = async (): Promise<SystemAnalytics> => {
  await delay(600);
  const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
  const feed = JSON.parse(localStorage.getItem(KEYS.FEED) || '[]');
  const jobs = JSON.parse(localStorage.getItem(KEYS.JOBS) || '[]');
  
  const userCount = Object.keys(users).length;
  
  // Mock growth data - ensure no negative values
  const growth = [
    Math.max(0, userCount - 5), 
    Math.max(0, userCount - 4), 
    Math.max(0, userCount - 2), 
    Math.max(0, userCount - 1), 
    userCount, 
    userCount + 2, 
    userCount + 5
  ];

  return {
    totalUsers: userCount,
    totalPosts: feed.length,
    totalJobs: jobs.length,
    totalRevenue: userCount * 1500 + jobs.length * 50, // Mock revenue calc
    userGrowth: growth,
    activeSessions: Math.floor(Math.random() * 20) + 5
  };
};

export const getAllUsers = async (): Promise<any[]> => {
    await delay(400);
    const users = JSON.parse(localStorage.getItem(KEYS.USERS) || '{}');
    return Object.values(users).map((u: any) => {
        const { password, ...safe } = u;
        return safe;
    });
};

// --- FEED ---

export const getFeedPosts = async (): Promise<FeedPost[]> => {
  await delay(400);
  return JSON.parse(localStorage.getItem(KEYS.FEED) || '[]');
};

export const createFeedPost = async (post: FeedPost): Promise<FeedPost> => {
  await delay(600);
  const posts = JSON.parse(localStorage.getItem(KEYS.FEED) || '[]');
  const newPost = { ...post, id: Date.now().toString(), timestamp: 'Just now' };
  localStorage.setItem(KEYS.FEED, JSON.stringify([newPost, ...posts]));
  return newPost;
};

export const toggleLikeFeedPost = async (postId: string, userId: string): Promise<FeedPost[]> => {
    // In a real DB, we would track likes by userId to prevent double liking.
    // For this simulation, we just toggle the count locally on the object.
    const posts = JSON.parse(localStorage.getItem(KEYS.FEED) || '[]');
    const updatedPosts = posts.map((p: FeedPost) => {
        if (p.id === postId) {
            return {
                ...p,
                liked: !p.liked,
                likes: p.liked ? p.likes - 1 : p.likes + 1
            };
        }
        return p;
    });
    localStorage.setItem(KEYS.FEED, JSON.stringify(updatedPosts));
    return updatedPosts;
};

// --- FORUM ---

export const getForumPosts = async (): Promise<ForumPost[]> => {
  await delay(400);
  return JSON.parse(localStorage.getItem(KEYS.FORUM) || '[]');
};

export const createForumPost = async (post: Partial<ForumPost>): Promise<ForumPost> => {
  await delay(600);
  const posts = JSON.parse(localStorage.getItem(KEYS.FORUM) || '[]');
  const newPost: ForumPost = {
    id: Date.now().toString(),
    authorId: post.authorId!,
    authorName: post.authorName!,
    authorAvatar: post.authorAvatar!,
    title: post.title!,
    content: post.content!,
    likes: 0,
    comments: 0,
    tags: post.tags || [],
    timestamp: 'Just now',
    isTrending: false
  };
  localStorage.setItem(KEYS.FORUM, JSON.stringify([newPost, ...posts]));
  return newPost;
};

// --- JOBS ---

export const getFreelanceJobs = async (): Promise<FreelanceJob[]> => {
  await delay(400);
  return JSON.parse(localStorage.getItem(KEYS.JOBS) || '[]');
};

export const createFreelanceJob = async (job: Partial<FreelanceJob>): Promise<FreelanceJob> => {
    await delay(600);
    const jobs = JSON.parse(localStorage.getItem(KEYS.JOBS) || '[]');
    const newJob: FreelanceJob = {
        id: Date.now().toString(),
        clientId: job.clientId!,
        clientName: job.clientName!,
        clientAvatar: job.clientAvatar!,
        title: job.title!,
        description: job.description!,
        budget: job.budget!,
        type: job.type!,
        deadline: job.deadline || 'Open',
        tags: job.tags || [],
        postedAt: 'Just now'
    };
    localStorage.setItem(KEYS.JOBS, JSON.stringify([newJob, ...jobs]));
    return newJob;
};


// Helper
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));