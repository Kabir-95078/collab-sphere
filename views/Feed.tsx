
import React, { useState, useEffect } from 'react';
import { FeedPost } from '../types';
import { getFeedPosts, createFeedPost, toggleLikeFeedPost } from '../services/backendService';

const Feed: React.FC = () => {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Load User
    const storedUser = localStorage.getItem('collabsphere_active_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser({
        name: 'Guest User',
        handle: '@guest',
        avatarUrl: 'https://ui-avatars.com/api/?name=Guest&background=333&color=fff'
      });
    }

    // Load Posts
    const loadPosts = async () => {
        try {
            const fetchedPosts = await getFeedPosts();
            setPosts(fetchedPosts);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    loadPosts();
  }, []);

  const handlePost = async () => {
    if (!newPostContent.trim()) return;
    setIsPosting(true);

    try {
        const newPostData: FeedPost = {
            id: '', // Backend handles ID
            authorId: user.email || 'guest',
            authorName: user.name,
            authorHandle: user.handle,
            authorAvatar: user.avatarUrl,
            content: newPostContent,
            likes: 0,
            comments: 0,
            shares: 0,
            timestamp: '',
            liked: false
        };

        const createdPost = await createFeedPost(newPostData);
        setPosts(prev => [createdPost, ...prev]);
        setNewPostContent('');
    } catch (e) {
        alert("Failed to post.");
    } finally {
        setIsPosting(false);
    }
  };

  const handleLike = async (postId: string) => {
    // Optimistic UI update
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
        }
        return p;
    }));

    // Background call
    await toggleLikeFeedPost(postId, user.email);
  };

  return (
    <div className="p-6 md:p-10 max-w-4xl mx-auto pb-24 md:pb-10 animate-[fadeIn_0.5s_ease-out]">
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Social Feed</h1>
        <p className="text-gray-400">See what creators are working on right now.</p>
      </div>

      <div className="glass-panel p-6 rounded-xl mb-8 border border-brand-base/50 relative overflow-hidden group">
        <div className="flex gap-4">
           <img 
              src={user?.avatarUrl} 
              alt="Me" 
              className="w-12 h-12 rounded-full border border-brand-plum"
           />
           <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder="Drop some content! What are you creating today?"
                className="w-full bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-pink resize-none h-24 placeholder-gray-500 transition-all focus:bg-brand-deep/80"
              />
              <div className="flex justify-between items-center mt-3">
                 <div className="flex gap-2">
                    <button className="text-brand-blue hover:text-white p-2 rounded-full hover:bg-brand-base/50 transition-colors">
                       <i className="fas fa-image"></i>
                    </button>
                    <button className="text-brand-pink hover:text-white p-2 rounded-full hover:bg-brand-base/50 transition-colors">
                       <i className="fas fa-video"></i>
                    </button>
                 </div>
                 <button
                    onClick={handlePost}
                    disabled={!newPostContent.trim() || isPosting}
                    className={`
                       px-6 py-2 rounded-lg font-bold text-sm shadow-lg transition-all
                       ${!newPostContent.trim() || isPosting 
                         ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                         : 'bg-brand-pink hover:bg-brand-plum text-white hover:scale-105 active:scale-95'}
                    `}
                 >
                    {isPosting ? <i className="fas fa-spinner fa-spin"></i> : 'Drop Post'}
                 </button>
              </div>
           </div>
        </div>
      </div>

      {loading ? (
          <div className="space-y-4">
              {[1,2,3].map(i => <div key={i} className="h-40 glass-panel rounded-xl animate-pulse"></div>)}
          </div>
      ) : (
          <div className="space-y-6">
             {posts.map((post, index) => (
                <div 
                   key={post.id} 
                   className="glass-panel p-6 rounded-xl hover:bg-brand-base/30 transition-all duration-300 animate-fade-in-up border border-brand-base/30 hover:border-brand-pink/30"
                   style={{ animationDelay: `${index * 100}ms` }}
                >
                   <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                         <img src={post.authorAvatar} alt={post.authorName} className="w-10 h-10 rounded-full object-cover border border-brand-base" />
                         <div>
                            <h3 className="font-bold text-white text-sm hover:text-brand-pink cursor-pointer transition-colors">{post.authorName}</h3>
                            <p className="text-xs text-gray-500">{post.authorHandle} • {post.timestamp}</p>
                         </div>
                      </div>
                      <button className="text-gray-500 hover:text-white transition-colors">
                         <i className="fas fa-ellipsis-h"></i>
                      </button>
                   </div>

                   <p className="text-gray-200 text-sm leading-relaxed mb-4 whitespace-pre-wrap">
                      {post.content}
                   </p>

                   {post.imageUrl && (
                      <div className="mb-4 rounded-lg overflow-hidden border border-brand-base/50">
                         <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover hover:scale-[1.02] transition-transform duration-500 cursor-pointer" />
                      </div>
                   )}

                   <div className="flex items-center justify-between border-t border-brand-base/50 pt-3">
                      <div className="flex gap-6">
                         <button 
                            onClick={() => handleLike(post.id)}
                            className={`flex items-center gap-2 text-sm transition-all hover:scale-110 active:scale-90 ${post.liked ? 'text-brand-pink' : 'text-gray-400 hover:text-brand-pink'}`}
                         >
                            <i className={`${post.liked ? 'fas' : 'far'} fa-heart ${post.liked ? 'animate-pulse' : ''}`}></i>
                            <span>{post.likes}</span>
                         </button>
                         <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-brand-blue transition-all hover:scale-110 active:scale-90">
                            <i className="far fa-comment-alt"></i>
                            <span>{post.comments}</span>
                         </button>
                         <button className="flex items-center gap-2 text-sm text-gray-400 hover:text-green-400 transition-all hover:scale-110 active:scale-90">
                            <i className="fas fa-retweet"></i>
                            <span>{post.shares}</span>
                         </button>
                      </div>
                   </div>
                </div>
             ))}
          </div>
      )}
      
      {!loading && posts.length === 0 && (
          <div className="text-center py-10 text-gray-500">No posts yet. Be the first!</div>
      )}

      <div className="text-center mt-12 mb-6">
         <p className="text-gray-500 text-sm">You're all caught up!</p>
         <div className="w-2 h-2 bg-brand-base rounded-full mx-auto mt-2"></div>
      </div>

    </div>
  );
};

export default Feed;
