import React, { useState, useEffect } from 'react';
import { Platform } from '../types';

interface ProfileProps {
  onLogout: () => void;
}

const Profile: React.FC<ProfileProps> = ({ onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Load user data from localStorage on mount
  useEffect(() => {
    const activeUserJson = localStorage.getItem('collabsphere_active_user');
    if (activeUserJson) {
      setUserData(JSON.parse(activeUserJson));
    } else {
        // Fallback or redirect could happen here
    }
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API delay
    await new Promise(r => setTimeout(r, 600));

    // Update 'active' session
    localStorage.setItem('collabsphere_active_user', JSON.stringify(userData));

    // Update 'database' (the users object) if it's a real persistent user
    const usersJson = localStorage.getItem('collabsphere_users');
    if (usersJson && userData.email) {
        const users = JSON.parse(usersJson);
        // Only update if the user exists in our "db"
        if (users[userData.email]) {
            users[userData.email] = { ...users[userData.email], ...userData };
            localStorage.setItem('collabsphere_users', JSON.stringify(users));
        }
    }

    setIsSaving(false);
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setUserData((prev: any) => ({ ...prev, [field]: value }));
  };

  if (!userData) {
    return <div className="p-10 text-white">Loading profile...</div>;
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 h-full overflow-y-auto">
      
      {/* Header / Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8 shadow-2xl glass-panel group">
        {/* Banner */}
        <div className="h-48 w-full bg-gradient-to-r from-brand-base via-brand-plum to-brand-deep relative">
            <div className="absolute inset-0 bg-black/20"></div>
            <div className="absolute bottom-4 right-4 flex gap-2">
                 <button className="bg-black/40 hover:bg-black/60 text-white px-3 py-1 rounded-lg text-xs backdrop-blur-md transition-all hover:scale-105">
                    <i className="fas fa-camera mr-1"></i> Change Cover
                 </button>
            </div>
        </div>
        
        {/* Profile Info Row */}
        <div className="px-8 pb-8 flex flex-col md:flex-row items-end md:items-center gap-6 -mt-12 relative z-10">
          <div className="relative">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-brand-deep bg-brand-base overflow-hidden shadow-lg">
               {/* Use a placeholder based on name initials if no avatar, or a random image */}
               <img 
                 src={`https://ui-avatars.com/api/?name=${encodeURIComponent(userData.name)}&background=C41E5D&color=fff&size=256`} 
                 alt="Profile" 
                 className="w-full h-full object-cover"
               />
            </div>
            {isEditing && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                    <i className="fas fa-camera text-white"></i>
                </div>
            )}
          </div>

          <div className="flex-1 min-w-0 mb-2">
             <div className="flex items-center gap-3">
                {isEditing ? (
                    <input 
                        type="text" 
                        value={userData.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-brand-deep/50 border border-brand-base rounded px-2 py-1 text-2xl font-bold text-white focus:outline-none focus:ring-2 focus:ring-brand-pink"
                    />
                ) : (
                    <h1 className="text-3xl font-bold text-white truncate">{userData.name}</h1>
                )}
                <span className="bg-brand-pink text-white text-xs px-2 py-0.5 rounded-full shadow-lg">Pro</span>
             </div>
             <div className="flex items-center gap-2 text-gray-300 mt-1">
                {isEditing ? (
                    <input 
                        type="text" 
                        value={userData.handle}
                        onChange={(e) => handleInputChange('handle', e.target.value)}
                        className="bg-brand-deep/50 border border-brand-base rounded px-2 py-0.5 text-sm text-white"
                        placeholder="@handle"
                    />
                ) : (
                    <span className="font-mono">{userData.handle}</span>
                )}
                <span>•</span>
                <span className="flex items-center gap-1">
                    <i className="fas fa-map-marker-alt text-xs"></i> Global
                </span>
                <span>•</span>
                <span className="text-gray-400 text-xs">Joined {new Date(userData.joinedAt || Date.now()).toLocaleDateString()}</span>
             </div>
          </div>

          <div className="flex gap-3 mb-2">
            {isEditing ? (
                 <>
                    <button 
                        onClick={() => setIsEditing(false)}
                        className="bg-brand-base hover:bg-brand-plum text-white px-4 py-2 rounded-lg font-medium transition-colors"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSave}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 flex items-center gap-2 shadow-lg shadow-green-900/20"
                        disabled={isSaving}
                    >
                        {isSaving ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-check"></i>}
                        Save Changes
                    </button>
                 </>
            ) : (
                <>
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-brand-base hover:bg-brand-plum text-white px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95 border border-brand-plum"
                    >
                        <i className="fas fa-pen mr-2 text-xs"></i> Edit Profile
                    </button>
                    <button 
                        onClick={onLogout}
                        className="bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 px-4 py-2 rounded-lg font-medium transition-all hover:scale-105 active:scale-95"
                    >
                        <i className="fas fa-sign-out-alt"></i>
                    </button>
                </>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Stats & Details */}
        <div className="lg:col-span-1 space-y-6">
            
            {/* Stats Card */}
            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Dashboard Stats</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-brand-deep/60 p-4 rounded-lg text-center border border-brand-base hover:border-brand-pink transition-colors">
                        <div className="text-2xl font-bold text-white mb-1">12</div>
                        <div className="text-xs text-gray-500">Collab Requests</div>
                    </div>
                    <div className="bg-brand-deep/60 p-4 rounded-lg text-center border border-brand-base hover:border-brand-pink transition-colors">
                        <div className="text-2xl font-bold text-brand-pink mb-1">85%</div>
                        <div className="text-xs text-gray-500">Avg. Match Score</div>
                    </div>
                    <div className="bg-brand-deep/60 p-4 rounded-lg text-center border border-brand-base hover:border-brand-pink transition-colors">
                        <div className="text-2xl font-bold text-brand-blue mb-1">3</div>
                        <div className="text-xs text-gray-500">Active Deals</div>
                    </div>
                    <div className="bg-brand-deep/60 p-4 rounded-lg text-center border border-brand-base hover:border-brand-pink transition-colors">
                        <div className="text-2xl font-bold text-purple-400 mb-1">2.4k</div>
                        <div className="text-xs text-gray-500">Profile Views</div>
                    </div>
                </div>
            </div>

            {/* About / Details */}
            <div className="glass-panel p-6 rounded-xl">
                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">About Me</h3>
                
                <div className="space-y-4">
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Bio</label>
                        {isEditing ? (
                            <textarea
                                value={userData.bio}
                                onChange={(e) => handleInputChange('bio', e.target.value)}
                                className="w-full bg-brand-deep border border-brand-base rounded-lg p-2 text-sm text-white h-24 focus:ring-1 focus:ring-brand-pink outline-none"
                            />
                        ) : (
                            <p className="text-sm text-gray-300 leading-relaxed">{userData.bio || "No bio yet."}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Niche</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={userData.niche}
                                    onChange={(e) => handleInputChange('niche', e.target.value)}
                                    className="w-full bg-brand-deep border border-brand-base rounded-lg p-2 text-sm text-white"
                                />
                            ) : (
                                <div className="text-sm text-white bg-brand-deep px-3 py-1.5 rounded-lg inline-block border border-brand-base">
                                    {userData.niche || "General"}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="text-xs text-gray-500 block mb-1">Subscribers</label>
                            {isEditing ? (
                                <input
                                    type="text"
                                    value={userData.subscribers}
                                    onChange={(e) => handleInputChange('subscribers', e.target.value)}
                                    className="w-full bg-brand-deep border border-brand-base rounded-lg p-2 text-sm text-white"
                                />
                            ) : (
                                <div className="text-sm text-white bg-brand-deep px-3 py-1.5 rounded-lg inline-block border border-brand-base">
                                    {userData.subscribers || "0"}
                                </div>
                            )}
                        </div>
                    </div>
                    
                    <div>
                        <label className="text-xs text-gray-500 block mb-1">Primary Platform</label>
                        {isEditing ? (
                            <select
                                value={userData.platform}
                                onChange={(e) => handleInputChange('platform', e.target.value)}
                                className="w-full bg-brand-deep border border-brand-base rounded-lg p-2 text-sm text-white"
                            >
                                {Object.values(Platform).map(p => (
                                    <option key={p} value={p}>{p}</option>
                                ))}
                            </select>
                        ) : (
                            <div className="flex items-center gap-2 text-white">
                                <i className={`fab fa-${userData.platform === Platform.YOUTUBE ? 'youtube' : userData.platform === Platform.INSTAGRAM ? 'instagram' : 'tiktok'}`}></i>
                                <span>{userData.platform}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Recent Activity / Feed */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* Action Card */}
            <div className="glass-panel p-6 rounded-xl flex items-center justify-between bg-gradient-to-r from-brand-base/40 to-brand-deep/40 border-l-4 border-l-brand-pink">
                <div>
                    <h3 className="font-bold text-white text-lg">Boost Your Reach</h3>
                    <p className="text-gray-400 text-sm">Connect your analytics to get smarter AI matches.</p>
                </div>
                <button className="px-4 py-2 bg-brand-pink hover:bg-brand-plum text-white rounded-lg text-sm font-medium transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-pink/20">
                    Connect Analytics
                </button>
            </div>

            {/* Recent Matches */}
            <div>
                <h3 className="text-lg font-bold text-white mb-4">Recent Activity</h3>
                <div className="space-y-4">
                    {/* Mock Activity Item 1 */}
                    <div className="glass-panel p-4 rounded-xl flex items-start gap-4 hover:bg-brand-base/60 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fas fa-check"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-300">
                                <span className="font-bold text-white">Strategy Generated</span> for collab with <span className="text-brand-pink">@marcocooks</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">2 hours ago</p>
                            <div className="mt-2 text-xs bg-brand-deep p-2 rounded border border-brand-base text-gray-400 italic">
                                "High potential for viral cooking challenge..."
                            </div>
                        </div>
                    </div>

                    {/* Mock Activity Item 2 */}
                    <div className="glass-panel p-4 rounded-xl flex items-start gap-4 hover:bg-brand-base/60 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-brand-blue/20 text-brand-blue flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fas fa-user-plus"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-300">
                                You updated your <span className="font-bold text-white">Niche</span> to "Tech & Lifestyle"
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Yesterday</p>
                        </div>
                    </div>
                    
                    {/* Mock Activity Item 3 */}
                    <div className="glass-panel p-4 rounded-xl flex items-start gap-4 hover:bg-brand-base/60 transition-colors group">
                        <div className="w-10 h-10 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                            <i className="fas fa-star"></i>
                        </div>
                        <div className="flex-1">
                            <p className="text-sm text-gray-300">
                                New Badge Earned: <span className="font-bold text-white">Early Adopter</span>
                            </p>
                            <p className="text-xs text-gray-500 mt-1">3 days ago</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Account Settings Preview */}
            <div className="glass-panel p-6 rounded-xl">
                 <h3 className="text-lg font-bold text-white mb-4">Account Settings</h3>
                 <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-base/50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3">
                            <i className="fas fa-bell text-gray-400 group-hover:text-brand-pink transition-colors"></i>
                            <span className="text-sm text-gray-200">Notifications</span>
                        </div>
                        <i className="fas fa-chevron-right text-xs text-gray-600 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-base/50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3">
                            <i className="fas fa-lock text-gray-400 group-hover:text-brand-pink transition-colors"></i>
                            <span className="text-sm text-gray-200">Privacy & Security</span>
                        </div>
                        <i className="fas fa-chevron-right text-xs text-gray-600 group-hover:translate-x-1 transition-transform"></i>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg hover:bg-brand-base/50 cursor-pointer transition-colors group">
                        <div className="flex items-center gap-3">
                            <i className="fas fa-credit-card text-gray-400 group-hover:text-brand-pink transition-colors"></i>
                            <span className="text-sm text-gray-200">Subscription & Billing</span>
                        </div>
                        <span className="text-xs bg-brand-base text-brand-blue border border-brand-pink px-2 py-0.5 rounded">Pro Plan</span>
                    </div>
                 </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default Profile;