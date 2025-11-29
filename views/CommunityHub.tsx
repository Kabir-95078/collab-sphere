
import React, { useState, useEffect } from 'react';
import { ForumPost } from '../types';
import { getForumPosts, createForumPost } from '../services/backendService';

const CommunityHub: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('All');
  const filters = ['All', 'Trending', 'Advice', 'Collab', 'Growth'];
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  // New Post Form
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedTag, setSelectedTag] = useState('Advice');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem('collabsphere_active_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const loadData = async () => {
        const data = await getForumPosts();
        setPosts(data);
        setLoading(false);
    };
    loadData();
  }, []);

  const handleCreatePost = async () => {
    if(!title || !content) return;
    
    const newPost = await createForumPost({
        authorId: user?.email || 'anon',
        authorName: user?.name || 'Guest',
        authorAvatar: user?.avatarUrl,
        title,
        content,
        tags: [selectedTag]
    });

    setPosts(prev => [newPost, ...prev]);
    setShowModal(false);
    setTitle('');
    setContent('');
  };

  const displayedPosts = posts.filter(p => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'Trending') return p.isTrending;
    return p.tags.includes(activeFilter);
  });

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Community Hub</h1>
          <p className="text-gray-400">Connect, share, and grow with fellow creators.</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-brand-pink hover:bg-brand-plum text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-brand-pink/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
        >
          <i className="fas fa-plus"></i>
          Create Post
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="glass-panel w-full max-w-lg rounded-xl p-6 border border-brand-pink/30 animate-[zoomIn_0.2s_ease-out]">
                <h2 className="text-xl font-bold text-white mb-4">Start a Discussion</h2>
                <input 
                    className="w-full bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-white mb-3 focus:ring-1 focus:ring-brand-pink"
                    placeholder="Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                />
                <textarea 
                    className="w-full bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-white mb-3 h-32 focus:ring-1 focus:ring-brand-pink"
                    placeholder="What's on your mind?"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                />
                <select 
                    className="w-full bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-white mb-6"
                    value={selectedTag}
                    onChange={e => setSelectedTag(e.target.value)}
                >
                    {filters.slice(2).map(f => <option key={f} value={f}>{f}</option>)}
                </select>
                <div className="flex justify-end gap-2">
                    <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-300 hover:text-white">Cancel</button>
                    <button onClick={handleCreatePost} className="px-4 py-2 bg-brand-pink text-white rounded-lg hover:bg-brand-plum">Post</button>
                </div>
            </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3 space-y-6">
          <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {filters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`
                  px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap hover:scale-105
                  ${activeFilter === filter 
                    ? 'bg-white text-brand-deep shadow-lg scale-105' 
                    : 'bg-brand-base/30 text-gray-300 hover:bg-brand-base hover:text-white'}
                `}
              >
                {filter === 'Trending' && <i className="fas fa-fire mr-2 text-orange-500"></i>}
                {filter}
              </button>
            ))}
          </div>

          {loading ? <div className="text-white">Loading community...</div> : displayedPosts.map(post => (
            <div key={post.id} className="glass-panel p-6 rounded-xl hover:bg-brand-base/40 transition-colors group">
              <div className="flex items-start gap-4">
                <img src={post.authorAvatar} alt={post.authorName} className="w-12 h-12 rounded-full border border-brand-plum" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-bold text-lg mb-1 group-hover:text-brand-pink transition-colors cursor-pointer">{post.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-gray-400 mb-3">
                        <span className="text-gray-300">{post.authorName}</span>
                        <span>•</span>
                        <span>{post.timestamp}</span>
                        {post.isTrending && (
                          <span className="bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20 flex items-center gap-1">
                            <i className="fas fa-bolt text-[10px]"></i> Trending
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between border-t border-brand-base/50 pt-4">
                    <div className="flex items-center gap-4">
                      <button className="flex items-center gap-2 text-gray-400 hover:text-brand-pink transition-colors text-sm">
                        <i className="far fa-heart"></i> <span>{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-400 hover:text-brand-blue transition-colors text-sm">
                        <i className="far fa-comment"></i> <span>{post.comments}</span>
                      </button>
                    </div>
                    <div className="flex gap-2">
                      {post.tags.map(tag => (
                        <span key={tag} className="text-xs bg-brand-deep px-2 py-1 rounded text-gray-400">#{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <div className="lg:w-1/3 space-y-6">
          <div className="glass-panel p-6 rounded-xl bg-gradient-to-br from-brand-base to-brand-deep">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <i className="fas fa-trophy text-yellow-400 animate-pulse"></i>
              Top Contributors
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="relative">
                    <img src={`https://picsum.photos/200/200?random=${i+10}`} className="w-10 h-10 rounded-full" alt="User" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full text-[10px] text-brand-deep font-bold flex items-center justify-center border border-brand-deep">
                      {i}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">Creator {i}</p>
                    <p className="text-xs text-gray-400">1.2k Reputation</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityHub;
