
import React, { useEffect, useState } from 'react';
import { CreatorLevel } from '../types';
import { getCreatorLevel, parseSubscribers, getNextLevelThreshold, getLevelColor, getLevelBg, getLevelIcon, getLevelPerks } from '../utils/levelUtils';

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<any>(null);
  const [revenueData] = useState([4500, 3200, 5100, 4800, 6200, 5800, 7500]); // Mock data

  useEffect(() => {
    const storedUser = localStorage.getItem('collabsphere_active_user');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    } else {
      // Fallback mock
      setUserData({
        name: "Guest",
        subscribers: "125K",
        walletBalance: 12450.50,
        recentRevenue: 3200
      });
    }
  }, []);

  if (!userData) return <div className="p-10 text-white">Loading Dashboard...</div>;

  const currentLevel = getCreatorLevel(userData.subscribers || "0");
  const subCount = parseSubscribers(userData.subscribers || "0");
  const nextThreshold = getNextLevelThreshold(currentLevel);
  const progressPercent = Math.min(100, Math.max(5, (subCount / nextThreshold) * 100));
  const currentPerks = getLevelPerks(currentLevel);
  
  // Wallet Logic
  const walletBalance = userData.walletBalance || 4250.00;

  // Simple SVG Line Chart Logic
  const maxRev = Math.max(...revenueData);
  const chartPoints = revenueData.map((val, idx) => {
    const x = (idx / (revenueData.length - 1)) * 100;
    const y = 100 - (val / maxRev) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 space-y-8 animate-[fadeIn_0.5s_ease-out]">
      
      {/* Header Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
           <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
           <p className="text-gray-400">Welcome back, <span className="text-brand-blue font-semibold">{userData.name}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-brand-base/30 px-4 py-2 rounded-full border border-brand-plum/50">
           <span className="text-xs text-gray-300 uppercase tracking-wider">Current Period</span>
           <span className="text-sm font-bold text-white">Oct 2023</span>
           <i className="fas fa-calendar-alt text-brand-pink"></i>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Level Card */}
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
           <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 ${getLevelBg(currentLevel)} blur-2xl`}></div>
           <div className="flex justify-between items-start mb-4">
              <div className={`w-12 h-12 rounded-xl ${getLevelBg(currentLevel)}/20 flex items-center justify-center border ${getLevelColor(currentLevel)} shadow-lg`}>
                 <i className={`fas ${getLevelIcon(currentLevel)} text-xl`}></i>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-full bg-brand-deep border ${getLevelColor(currentLevel)} uppercase tracking-wider`}>
                 {currentLevel}
              </span>
           </div>
           <p className="text-gray-400 text-xs uppercase tracking-widest">Creator Tier</p>
           <h3 className="text-2xl font-bold text-white mt-1">{currentLevel}</h3>
        </div>

        {/* Followers Card */}
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
           <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 bg-brand-blue blur-2xl"></div>
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-blue/20 flex items-center justify-center border border-brand-blue text-brand-blue shadow-lg shadow-brand-blue/20">
                 <i className="fas fa-users text-xl"></i>
              </div>
              <span className="text-xs font-bold px-2 py-1 rounded-full bg-green-500/20 text-green-400 border border-green-500/30">
                 +12% <i className="fas fa-arrow-up"></i>
              </span>
           </div>
           <p className="text-gray-400 text-xs uppercase tracking-widest">Audience</p>
           <h3 className="text-2xl font-bold text-white mt-1">{userData.subscribers || "0"}</h3>
        </div>

        {/* Revenue Card */}
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform">
           <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full opacity-20 bg-green-500 blur-2xl"></div>
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center border border-green-500 text-green-500 shadow-lg shadow-green-500/20">
                 <i className="fas fa-chart-line text-xl"></i>
              </div>
           </div>
           <p className="text-gray-400 text-xs uppercase tracking-widest">Total Revenue</p>
           <h3 className="text-2xl font-bold text-white mt-1">${(revenueData.reduce((a, b) => a + b, 0)).toLocaleString()}</h3>
        </div>

        {/* Wallet Card */}
        <div className="glass-panel p-6 rounded-xl relative overflow-hidden group hover:scale-[1.02] transition-transform bg-gradient-to-br from-brand-base/80 to-brand-deep">
           <div className="flex justify-between items-start mb-4">
              <div className="w-12 h-12 rounded-xl bg-brand-pink/20 flex items-center justify-center border border-brand-pink text-brand-pink shadow-lg shadow-brand-pink/20">
                 <i className="fas fa-wallet text-xl"></i>
              </div>
              <button className="text-xs bg-brand-pink hover:bg-brand-plum text-white px-3 py-1.5 rounded-lg transition-colors shadow-lg">
                 Withdraw
              </button>
           </div>
           <p className="text-gray-300 text-xs uppercase tracking-widest">Wallet Balance</p>
           <h3 className="text-2xl font-bold text-white mt-1">${walletBalance.toLocaleString()}</h3>
        </div>
      </div>

      {/* Graphs & Progress Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Revenue Graph */}
        <div className="lg:col-span-2 glass-panel p-6 rounded-xl border border-brand-base/50">
           <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-white text-lg flex items-center gap-2">
                <i className="fas fa-chart-area text-brand-pink"></i> Revenue Growth
              </h3>
              <select className="bg-brand-deep text-xs text-gray-300 border border-brand-base rounded-lg p-2 focus:ring-1 focus:ring-brand-pink outline-none">
                 <option>Last 7 Days</option>
                 <option>Last Month</option>
                 <option>Last Year</option>
              </select>
           </div>
           
           <div className="h-64 w-full relative">
              {/* Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between text-xs text-gray-600">
                 <div className="border-b border-gray-800 w-full h-0"></div>
                 <div className="border-b border-gray-800 w-full h-0"></div>
                 <div className="border-b border-gray-800 w-full h-0"></div>
                 <div className="border-b border-gray-800 w-full h-0"></div>
                 <div className="border-b border-gray-800 w-full h-0"></div>
              </div>
              
              {/* SVG Chart */}
              <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full absolute inset-0 overflow-visible">
                 <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                       <stop offset="0%" stopColor="#C41E5D" stopOpacity="0.5" />
                       <stop offset="100%" stopColor="#C41E5D" stopOpacity="0" />
                    </linearGradient>
                 </defs>
                 <path 
                    d={`M0,100 L0,${100 - (revenueData[0]/maxRev)*100} ${chartPoints} L100,100 Z`} 
                    fill="url(#gradient)" 
                 />
                 <polyline 
                    fill="none" 
                    stroke="#C41E5D" 
                    strokeWidth="2" 
                    points={chartPoints} 
                    vectorEffect="non-scaling-stroke"
                    className="drop-shadow-[0_0_10px_rgba(196,30,93,0.5)]"
                 />
                 {/* Points */}
                 {revenueData.map((val, idx) => {
                    const x = (idx / (revenueData.length - 1)) * 100;
                    const y = 100 - (val / maxRev) * 100;
                    return (
                        <circle key={idx} cx={x} cy={y} r="1.5" fill="#fff" className="hover:r-2 transition-all" />
                    );
                 })}
              </svg>
           </div>
           <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
              <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
           </div>
        </div>

        {/* Level Progress & Perks */}
        <div className="glass-panel p-0 rounded-xl flex flex-col overflow-hidden border border-brand-base/50">
           
           {/* Progress Visual */}
           <div className="p-6 pb-2 relative bg-gradient-to-b from-brand-base/20 to-transparent">
               <div className="flex justify-between items-end mb-4 relative z-10">
                  <div>
                      <h3 className="font-bold text-white text-lg">Next Milestone</h3>
                      <p className="text-gray-400 text-xs">{(nextThreshold/1000).toFixed(0)}k Subscribers</p>
                  </div>
                  <div className="text-right">
                      <span className={`text-2xl font-bold ${getLevelColor(currentLevel).split(' ')[0]}`}>{Math.round(progressPercent)}%</span>
                  </div>
               </div>

               <div className="w-full h-3 bg-brand-deep rounded-full overflow-hidden mb-6 shadow-inner relative z-10">
                  <div 
                    className={`h-full ${getLevelBg(currentLevel)} relative`} 
                    style={{ width: `${progressPercent}%` }}
                  >
                     <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                  </div>
               </div>
               
               {/* Background Icon */}
               <i className={`fas ${getLevelIcon(currentLevel)} absolute -bottom-4 -right-4 text-9xl opacity-5 transform rotate-12`}></i>
           </div>

           {/* Perks List */}
           <div className="flex-1 p-6 bg-brand-deep/30">
               <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">
                  <i className="fas fa-star text-yellow-500 mr-2"></i> 
                  {currentLevel} Benefits
               </h4>
               <ul className="space-y-3">
                  {currentPerks.map((perk, index) => (
                      <li key={index} className="flex items-start gap-3 text-sm text-gray-300">
                         <i className="fas fa-check-circle text-brand-pink mt-0.5"></i>
                         <span>{perk}</span>
                      </li>
                  ))}
               </ul>
               
               {currentLevel !== CreatorLevel.MASTER && (
                   <div className="mt-4 pt-4 border-t border-brand-base/30">
                      <p className="text-xs text-gray-500 italic">
                         Next level unlocks: <span className="text-white">Lower Fees, More AI Credits</span>
                      </p>
                   </div>
               )}
           </div>
        </div>
      </div>
      
      {/* Recent Transactions / Wallet History */}
      <div className="glass-panel p-6 rounded-xl border border-brand-base/50">
         <div className="flex justify-between items-center mb-4">
             <h3 className="font-bold text-white text-lg">Recent Transactions</h3>
             <button className="text-xs text-brand-blue hover:text-white transition-colors">View All</button>
         </div>
         <div className="overflow-x-auto">
            <table className="w-full text-left">
               <thead>
                  <tr className="text-xs text-gray-500 border-b border-brand-base">
                     <th className="pb-3 pl-2">Type</th>
                     <th className="pb-3">Description</th>
                     <th className="pb-3">Date</th>
                     <th className="pb-3 text-right pr-2">Amount</th>
                  </tr>
               </thead>
               <tbody className="text-sm">
                  <tr className="hover:bg-brand-base/30 transition-colors">
                     <td className="py-3 pl-2"><span className="bg-green-500/20 text-green-400 px-2 py-0.5 rounded text-[10px] font-bold uppercase">Incoming</span></td>
                     <td className="py-3 text-gray-200">Collab Payment from @marcocooks</td>
                     <td className="py-3 text-gray-400">Oct 24, 2023</td>
                     <td className="py-3 text-right font-mono text-white pr-2">+$1,200.00</td>
                  </tr>
                  <tr className="hover:bg-brand-base/30 transition-colors">
                     <td className="py-3 pl-2"><span className="bg-brand-pink/20 text-brand-pink px-2 py-0.5 rounded text-[10px] font-bold uppercase">Withdrawal</span></td>
                     <td className="py-3 text-gray-200">Transfer to Bank Account ****4589</td>
                     <td className="py-3 text-gray-400">Oct 21, 2023</td>
                     <td className="py-3 text-right font-mono text-white pr-2">-$500.00</td>
                  </tr>
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
};

export default Dashboard;
