import React, { useEffect, useState } from 'react';
import { getSystemAnalytics, getAllUsers } from '../services/backendService';
import { SystemAnalytics } from '../types';

const AdminPanel: React.FC = () => {
  const [analytics, setAnalytics] = useState<SystemAnalytics | null>(null);
  const [userList, setUserList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await getSystemAnalytics();
        const users = await getAllUsers();
        setAnalytics(stats);
        setUserList(users.slice(0, 10)); // Show last 10 users
      } catch (e) {
        console.error("Failed to load admin data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  if (isLoading || !analytics) {
    return (
      <div className="p-10 flex flex-col items-center justify-center text-white min-h-[50vh]">
        <i className="fas fa-cog fa-spin text-4xl text-brand-pink mb-4"></i>
        <p>Accessing Secure Mainframe...</p>
      </div>
    );
  }

  // Calculate SVG Graph points
  const maxVal = Math.max(...analytics.userGrowth);
  const points = analytics.userGrowth.map((val, idx) => {
      const x = (idx / (analytics.userGrowth.length - 1)) * 100;
      const y = 100 - (val / (maxVal * 1.2)) * 100;
      return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 animate-[fadeIn_0.5s_ease-out]">
      
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-lg bg-red-600 flex items-center justify-center shadow-lg shadow-red-600/30">
             <i className="fas fa-shield-alt text-white text-xl"></i>
        </div>
        <div>
            <h1 className="text-3xl font-bold text-white">Admin Console</h1>
            <p className="text-gray-400 text-sm font-mono">System Status: <span className="text-green-400">ONLINE</span></p>
        </div>
      </div>

      {/* Top Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
         <div className="glass-panel p-6 rounded-xl border-t-4 border-t-brand-blue">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Total Users</p>
            <h2 className="text-3xl font-bold text-white">{analytics.totalUsers}</h2>
            <p className="text-xs text-green-400 mt-2"><i className="fas fa-arrow-up"></i> +5 this week</p>
         </div>
         <div className="glass-panel p-6 rounded-xl border-t-4 border-t-brand-pink">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">System Revenue</p>
            <h2 className="text-3xl font-bold text-white">${analytics.totalRevenue.toLocaleString()}</h2>
            <p className="text-xs text-green-400 mt-2"><i className="fas fa-arrow-up"></i> +12% MoM</p>
         </div>
         <div className="glass-panel p-6 rounded-xl border-t-4 border-t-yellow-500">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Active Jobs</p>
            <h2 className="text-3xl font-bold text-white">{analytics.totalJobs}</h2>
            <p className="text-gray-500 text-xs mt-2">Open Listings</p>
         </div>
         <div className="glass-panel p-6 rounded-xl border-t-4 border-t-green-500">
            <p className="text-gray-400 text-xs uppercase tracking-wider mb-2">Live Sessions</p>
            <h2 className="text-3xl font-bold text-white">{analytics.activeSessions}</h2>
            <p className="text-xs text-green-400 mt-2 animate-pulse">● Live Now</p>
         </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         
         {/* User Growth Chart */}
         <div className="lg:col-span-2 glass-panel p-6 rounded-xl">
             <h3 className="font-bold text-white mb-6">User Acquisition Velocity</h3>
             <div className="h-64 w-full relative">
                 <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 overflow-visible">
                    <defs>
                        <linearGradient id="adminGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#C41E5D" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#22040e" stopOpacity="0" />
                        </linearGradient>
                    </defs>
                    <path d={`M0,100 L0,${100 - (analytics.userGrowth[0] / (maxVal * 1.2)) * 100} ${points} L100,100 Z`} fill="url(#adminGradient)" />
                    <polyline fill="none" stroke="#fff" strokeWidth="2" points={points} vectorEffect="non-scaling-stroke" />
                 </svg>
             </div>
         </div>

         {/* System Logs */}
         <div className="glass-panel p-6 rounded-xl">
            <h3 className="font-bold text-white mb-4">Security Logs</h3>
            <div className="space-y-3 font-mono text-xs">
                <div className="flex items-start gap-2 text-gray-400">
                   <span className="text-green-500">[SUCCESS]</span>
                   <span>Database backup complete (14ms)</span>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                   <span className="text-brand-blue">[INFO]</span>
                   <span>New user registration: @democreator</span>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                   <span className="text-yellow-500">[WARN]</span>
                   <span>High API latency detected in region US-EAST</span>
                </div>
                <div className="flex items-start gap-2 text-gray-400">
                   <span className="text-green-500">[SUCCESS]</span>
                   <span>Gemini Model 2.5 handshake verified</span>
                </div>
            </div>
            <button className="mt-6 w-full py-2 border border-gray-600 rounded text-gray-400 hover:text-white hover:border-white transition-colors text-xs uppercase">
                Download Full Logs
            </button>
         </div>

      </div>

      {/* User Management Table */}
      <div className="mt-8 glass-panel p-6 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center mb-6">
             <h3 className="font-bold text-white">Recent Users</h3>
             <button className="text-xs bg-brand-pink px-3 py-1 rounded text-white">Export CSV</button>
          </div>
          <div className="overflow-x-auto">
             <table className="w-full text-left border-collapse">
                <thead>
                   <tr className="text-xs text-gray-500 uppercase border-b border-gray-800">
                      <th className="pb-3 pl-2">User</th>
                      <th className="pb-3">Role</th>
                      <th className="pb-3">Platform</th>
                      <th className="pb-3">Joined</th>
                      <th className="pb-3 text-right pr-2">Actions</th>
                   </tr>
                </thead>
                <tbody className="text-sm">
                   {userList.map((u, i) => (
                      <tr key={i} className="hover:bg-brand-base/20 transition-colors border-b border-gray-800/50 last:border-0">
                         <td className="py-3 pl-2">
                            <div className="flex items-center gap-3">
                               <img src={u.avatarUrl} className="w-8 h-8 rounded-full" alt="av" />
                               <div>
                                  <div className="font-bold text-white">{u.name}</div>
                                  <div className="text-xs text-gray-500">{u.email}</div>
                               </div>
                            </div>
                         </td>
                         <td className="py-3">
                            <span className={`px-2 py-0.5 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-red-500/20 text-red-500' : 'bg-brand-blue/20 text-brand-blue'}`}>
                                {u.role?.toUpperCase()}
                            </span>
                         </td>
                         <td className="py-3 text-gray-400">{u.platform}</td>
                         <td className="py-3 text-gray-400">{new Date(u.joinedAt).toLocaleDateString()}</td>
                         <td className="py-3 text-right pr-2">
                             <button className="text-gray-500 hover:text-white mx-1"><i className="fas fa-edit"></i></button>
                             <button className="text-gray-500 hover:text-red-500 mx-1"><i className="fas fa-trash"></i></button>
                         </td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </div>
      </div>

    </div>
  );
};

export default AdminPanel;