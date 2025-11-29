
import React, { useState, useEffect } from 'react';
import { FreelanceJob, JobType } from '../types';
import { getFreelanceJobs, createFreelanceJob } from '../services/backendService';

const Freelance: React.FC = () => {
  const [selectedType, setSelectedType] = useState<string>('All');
  const [jobs, setJobs] = useState<FreelanceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState<any>(null);

  // Form State
  const [jobTitle, setJobTitle] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [jobBudget, setJobBudget] = useState('');
  const [jobType, setJobType] = useState<JobType>(JobType.EDITING);

  useEffect(() => {
    const storedUser = localStorage.getItem('collabsphere_active_user');
    if (storedUser) setUser(JSON.parse(storedUser));
    
    const loadJobs = async () => {
        const data = await getFreelanceJobs();
        setJobs(data);
        setLoading(false);
    };
    loadJobs();
  }, []);

  const handlePostJob = async () => {
    if(!jobTitle || !jobDesc) return;
    const newJob = await createFreelanceJob({
        clientId: user?.email || 'guest',
        clientName: user?.name || 'Guest Client',
        clientAvatar: user?.avatarUrl,
        title: jobTitle,
        description: jobDesc,
        budget: jobBudget || 'Negotiable',
        type: jobType,
        tags: [jobType]
    });
    setJobs(prev => [newJob, ...prev]);
    setShowModal(false);
    // Reset form
    setJobTitle('');
    setJobDesc('');
    setJobBudget('');
  };

  const filteredJobs = selectedType === 'All' 
    ? jobs 
    : jobs.filter(job => job.type === selectedType);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 animate-[fadeIn_0.5s_ease-out]">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Freelance Market</h1>
          <p className="text-gray-400">Find top-tier talent or get hired for your skills.</p>
        </div>
        <button 
            onClick={() => setShowModal(true)}
            className="bg-white text-brand-deep hover:bg-gray-200 px-6 py-3 rounded-xl font-bold shadow-lg transition-all hover:scale-105 active:scale-95 duration-200 flex items-center gap-2"
        >
          <i className="fas fa-briefcase"></i>
          Post a Job
        </button>
      </div>

      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="glass-panel w-full max-w-lg rounded-xl p-6 border border-brand-blue/30 animate-[zoomIn_0.2s_ease-out]">
                  <h2 className="text-xl font-bold text-white mb-4">Post a Job</h2>
                  <input className="w-full bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-white mb-3" placeholder="Job Title" value={jobTitle} onChange={e => setJobTitle(e.target.value)} />
                  <textarea className="w-full bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-white mb-3 h-24" placeholder="Description" value={jobDesc} onChange={e => setJobDesc(e.target.value)} />
                  <div className="grid grid-cols-2 gap-4 mb-6">
                      <input className="bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-white" placeholder="Budget (e.g. $500)" value={jobBudget} onChange={e => setJobBudget(e.target.value)} />
                      <select className="bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-white" value={jobType} onChange={e => setJobType(e.target.value as JobType)}>
                          {Object.values(JobType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                  </div>
                  <div className="flex justify-end gap-2">
                      <button onClick={() => setShowModal(false)} className="px-4 py-2 text-gray-300">Cancel</button>
                      <button onClick={handlePostJob} className="px-4 py-2 bg-brand-blue text-brand-deep font-bold rounded-lg hover:bg-blue-300">Publish Job</button>
                  </div>
              </div>
          </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-1/4">
           <div className="glass-panel p-6 rounded-xl sticky top-24">
              <h3 className="font-bold text-white mb-4 text-sm uppercase tracking-wider">Categories</h3>
              <div className="space-y-2">
                 <button 
                    onClick={() => setSelectedType('All')}
                    className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:pl-6 ${selectedType === 'All' ? 'bg-brand-pink text-white font-medium pl-6' : 'text-gray-400 hover:text-white hover:bg-brand-base/50'}`}
                 >
                    All Jobs
                 </button>
                 {Object.values(JobType).map(type => (
                    <button 
                        key={type}
                        onClick={() => setSelectedType(type)}
                        className={`w-full text-left px-4 py-2 rounded-lg text-sm transition-all duration-200 hover:pl-6 ${selectedType === type ? 'bg-brand-pink text-white font-medium pl-6' : 'text-gray-400 hover:text-white hover:bg-brand-base/50'}`}
                    >
                        {type}
                    </button>
                 ))}
              </div>
           </div>
        </div>

        <div className="lg:w-3/4 space-y-4">
           {loading ? <div className="text-white">Loading jobs...</div> : filteredJobs.map(job => (
              <div key={job.id} className="glass-panel p-6 rounded-xl hover:bg-brand-base/40 transition-all group border-l-4 border-l-brand-blue hover:translate-x-2 duration-300">
                 <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div className="flex items-start gap-4 flex-1">
                        <img src={job.clientAvatar} alt={job.clientName} className="w-14 h-14 rounded-lg object-cover shadow-md" />
                        <div>
                           <h3 className="text-xl font-bold text-white group-hover:text-brand-blue transition-colors">{job.title}</h3>
                           <div className="flex items-center gap-2 text-sm text-gray-400 mt-1 mb-2">
                              <span className="text-gray-300 font-medium">{job.clientName}</span>
                              <span className="w-1 h-1 rounded-full bg-gray-600"></span>
                              <span className="text-gray-500">Posted {job.postedAt}</span>
                           </div>
                           <p className="text-gray-300 text-sm mb-4 line-clamp-2">{job.description}</p>
                           
                           <div className="flex flex-wrap gap-2">
                              <span className="px-2 py-1 bg-brand-deep rounded text-xs text-brand-blue border border-brand-base">
                                 {job.type}
                              </span>
                              {job.tags.map(tag => (
                                 <span key={tag} className="px-2 py-1 bg-brand-deep/50 rounded text-xs text-gray-400">
                                    {tag}
                                 </span>
                              ))}
                           </div>
                        </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end gap-4 w-full md:w-auto mt-4 md:mt-0 justify-between md:justify-start">
                        <div className="text-right">
                           <p className="text-xs text-gray-500 uppercase">Budget</p>
                           <p className="text-lg font-bold text-green-400">{job.budget}</p>
                        </div>
                        <button className="bg-brand-blue hover:bg-blue-400 text-brand-deep font-bold py-2 px-6 rounded-lg transition-all hover:scale-105 active:scale-95 shadow-lg shadow-brand-blue/20">
                           Apply Now
                        </button>
                    </div>
                 </div>
              </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default Freelance;
