

import { Creator, Platform, ForumPost, FreelanceJob, JobType, FeedPost } from './types';

export const MOCK_CREATORS: Creator[] = [
  {
    id: '1',
    name: 'Sarah Tech',
    handle: '@sarahtechreviews',
    platform: Platform.YOUTUBE,
    subscribers: '2.4M',
    niche: 'Tech & Gadgets',
    bio: 'Unboxing the future, one gadget at a time. Deep dives into consumer electronics.',
    avatarUrl: 'https://picsum.photos/200/200?random=1',
    tags: ['Tech', 'Reviews', '4K'],
    collabFee: 5000
  },
  {
    id: '2',
    name: 'Chef Marco',
    handle: '@marcocooks',
    platform: Platform.INSTAGRAM,
    subscribers: '850K',
    niche: 'Food & Culinary',
    bio: 'Simple recipes for busy people. Italian roots, modern twist.',
    avatarUrl: 'https://picsum.photos/200/200?random=2',
    tags: ['Food', 'Cooking', 'Lifestyle'],
    collabFee: 2500
  },
  {
    id: '3',
    name: 'FitWithJess',
    handle: '@jessfitlife',
    platform: Platform.TIKTOK,
    subscribers: '1.2M',
    niche: 'Fitness & Health',
    bio: 'Daily workouts and nutrition tips to keep you moving.',
    avatarUrl: 'https://picsum.photos/200/200?random=3',
    tags: ['Fitness', 'Wellness', 'Vlog'],
    collabFee: 3200
  },
  {
    id: '4',
    name: 'Alex Travels',
    handle: '@alextravels_yt',
    platform: Platform.YOUTUBE,
    subscribers: '500K',
    niche: 'Travel & Documentary',
    bio: 'Documenting the hidden gems of the world. Cinematic storytelling.',
    avatarUrl: 'https://picsum.photos/200/200?random=4',
    tags: ['Travel', 'Cinematic', 'Documentary'],
    collabFee: 1800
  },
  {
    id: '5',
    name: 'StyleByLiam',
    handle: '@liamstyle',
    platform: Platform.INSTAGRAM,
    subscribers: '320K',
    niche: 'Fashion & Grooming',
    bio: 'Men\'s fashion advice and street style photography.',
    avatarUrl: 'https://picsum.photos/200/200?random=5',
    tags: ['Fashion', 'Streetwear', 'Photography'],
    collabFee: 1200
  },
  {
    id: '6',
    name: 'CryptoKing',
    handle: '@cryptoking_daily',
    platform: Platform.YOUTUBE,
    subscribers: '100K',
    niche: 'Finance & Crypto',
    bio: 'Breaking down complex financial topics for everyone.',
    avatarUrl: 'https://picsum.photos/200/200?random=6',
    tags: ['Finance', 'Crypto', 'Education'],
    collabFee: 800
  }
];

export const MOCK_FORUM_POSTS: ForumPost[] = [
  {
    id: '101',
    authorId: '1',
    authorName: 'Sarah Tech',
    authorAvatar: 'https://picsum.photos/200/200?random=1',
    title: 'How do you handle brand deal negotiations?',
    content: 'I recently got an offer from a major tech brand, but they are lowballing me on the integration fee. Any tips on how to counter without losing the deal?',
    likes: 342,
    comments: 56,
    tags: ['Advice', 'Sponsorships', 'Money'],
    timestamp: '2 hours ago',
    isTrending: true
  },
  {
    id: '102',
    authorId: '4',
    authorName: 'Alex Travels',
    authorAvatar: 'https://picsum.photos/200/200?random=4',
    title: 'Looking for a drone operator in Bali next month',
    content: 'Hey community! I will be shooting a documentary in Bali in November. Need someone with FPV drone experience. Paid gig!',
    likes: 89,
    comments: 12,
    tags: ['Collab', 'Hiring', 'Travel'],
    timestamp: '5 hours ago'
  },
  {
    id: '103',
    authorId: '3',
    authorName: 'FitWithJess',
    authorAvatar: 'https://picsum.photos/200/200?random=3',
    title: 'Shorts vs Reels vs TikTok: What is working for you?',
    content: 'I have seen a huge dip in Reels engagement lately, but Shorts are blowing up. Is anyone else experiencing this shift?',
    likes: 520,
    comments: 128,
    tags: ['Algorithm', 'Growth', 'Strategy'],
    timestamp: '1 day ago',
    isTrending: true
  }
];

export const MOCK_JOBS: FreelanceJob[] = [
  {
    id: '201',
    clientId: '6',
    clientName: 'CryptoKing',
    clientAvatar: 'https://picsum.photos/200/200?random=6',
    title: 'Expert Video Editor for Finance Channel',
    description: 'Looking for a fast-paced editor who understands retention editing. Must be good with motion graphics and stock footage overlays.',
    budget: '$400 - $800 per video',
    type: JobType.EDITING,
    deadline: 'ASAP',
    tags: ['Premiere Pro', 'After Effects', 'Finance'],
    postedAt: '3 hours ago'
  },
  {
    id: '202',
    clientId: '2',
    clientName: 'Chef Marco',
    clientAvatar: 'https://picsum.photos/200/200?random=2',
    title: 'Thumbnail Designer for Food Niche',
    description: 'Need high CTR thumbnails. Bright colors, appetizing contrast. I will provide the raw food photos.',
    budget: '$50 per thumbnail',
    type: JobType.DESIGN,
    deadline: 'Weekly',
    tags: ['Photoshop', 'Food', 'CTR'],
    postedAt: '1 day ago'
  },
  {
    id: '203',
    clientId: '1',
    clientName: 'Sarah Tech',
    clientAvatar: 'https://picsum.photos/200/200?random=1',
    title: 'Scriptwriter for Tech Reviews',
    description: 'I need help researching and outlining scripts for upcoming smartphone reviews. Must have technical knowledge.',
    budget: '$200 per script',
    type: JobType.SCRIPT,
    deadline: 'Flexible',
    tags: ['Writing', 'Tech', 'Research'],
    postedAt: '2 days ago'
  }
];

export const MOCK_FEED_POSTS: FeedPost[] = [
  {
    id: 'f1',
    authorId: '1',
    authorName: 'Sarah Tech',
    authorHandle: '@sarahtechreviews',
    authorAvatar: 'https://picsum.photos/200/200?random=1',
    content: 'Just dropped the new iPhone review! The camera upgrade is actually insane 📸 Check it out on the channel now. Would love to hear your thoughts on the new action button.',
    imageUrl: 'https://picsum.photos/600/400?random=10',
    likes: 1240,
    comments: 145,
    shares: 82,
    timestamp: '10 min ago'
  },
  {
    id: 'f2',
    authorId: '4',
    authorName: 'Alex Travels',
    authorHandle: '@alextravels_yt',
    authorAvatar: 'https://picsum.photos/200/200?random=4',
    content: 'Editing the Bali vlog and I honestly can’t believe we caught this sunset. Sometimes the best shots are the ones you didn’t plan for. 🌅 #CreatorLife #TravelVlog',
    imageUrl: 'https://picsum.photos/600/400?random=11',
    likes: 890,
    comments: 56,
    shares: 20,
    timestamp: '2 hours ago'
  },
  {
    id: 'f3',
    authorId: '2',
    authorName: 'Chef Marco',
    authorHandle: '@marcocooks',
    authorAvatar: 'https://picsum.photos/200/200?random=2',
    content: 'Experimenting with a new pasta dough recipe using 00 flour and extra yolks. The color is incredible! Video coming this Sunday.',
    likes: 2300,
    comments: 312,
    shares: 150,
    timestamp: '4 hours ago'
  },
  {
    id: 'f4',
    authorId: '5',
    authorName: 'StyleByLiam',
    authorHandle: '@liamstyle',
    authorAvatar: 'https://picsum.photos/200/200?random=5',
    content: 'Quick tip: Use natural lighting whenever possible for your OOTD shots. Even the best preset can’t fix bad lighting. 💡',
    likes: 450,
    comments: 23,
    shares: 12,
    timestamp: '5 hours ago'
  }
];