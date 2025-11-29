import React, { useState, useEffect } from 'react';
import { MOCK_CREATORS } from '../constants';
import CreatorCard from '../components/CreatorCard';
import { Creator, CollabStrategyResponse } from '../types';
import { generateCollabStrategy } from '../services/geminiService';
import { fetchCreators } from '../services/creatorService';

interface MatchmakerProps {
  initialTarget?: Creator | null;
}

const Matchmaker: React.FC<MatchmakerProps> = ({ initialTarget }) => {
  const [userBio, setUserBio] = useState('I am a tech YouTuber with 50k subs focusing on coding tutorials and developer lifestyle.');
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(initialTarget || null);
  const [isLoading, setIsLoading] = useState(false);
  const [strategy, setStrategy] = useState<CollabStrategyResponse | null>(null);
  
  // List of creators to choose from
  const [availableCreators, setAvailableCreators] = useState<Creator[]>(MOCK_CREATORS);

  useEffect(() => {
    // If we have an initial target that isn't in mocks, add it
    if (initialTarget && !availableCreators.find(c => c.id === initialTarget.id)) {
        setAvailableCreators(prev => [initialTarget, ...prev]);
    }
    
    // Fetch some fresh faces for the dropdown
    const loadFreshCreators = async () => {
        const fresh = await fetchCreators(10);
        setAvailableCreators(prev => {
            // Merge but avoid duplicates
            const ids = new Set(prev.map(c => c.id));
            const uniqueFresh = fresh.filter(c => !ids.has(c.id));
            return [...prev, ...uniqueFresh];
        });
    };
    loadFreshCreators();
  }, [initialTarget]);

  useEffect(() => {
      // Sync initialTarget if it changes via props
      if (initialTarget) {
          setSelectedCreator(initialTarget);
      }
  }, [initialTarget]);

  const handleGenerate = async () => {
    if (!selectedCreator || !userBio.trim()) return;

    setIsLoading(true);
    setStrategy(null); // Reset previous results

    try {
      const result = await generateCollabStrategy(userBio, selectedCreator);
      setStrategy(result);
    } catch (error) {
      console.error(error);
      alert("Failed to generate strategy. Please check your API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 pb-24 md:pb-10 h-full overflow-y-auto">
      {/* Left Column: Configuration */}
      <div className="lg:w-1/3 flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">AI Matchmaker</h1>
          <p className="text-gray-400 text-sm">Powered by Gemini 2.5 Flash</p>
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <label className="block text-sm font-medium text-gray-300 mb-2">Your Creator Profile</label>
          <textarea
            value={userBio}
            onChange={(e) => setUserBio(e.target.value)}
            className="w-full h-32 bg-brand-deep/50 border border-brand-base rounded-lg p-3 text-sm text-white focus:ring-2 focus:ring-brand-pink outline-none resize-none placeholder-gray-600"
            placeholder="Describe your channel, niche, and audience..."
          />
        </div>

        <div className="glass-panel p-6 rounded-xl">
          <label className="block text-sm font-medium text-gray-300 mb-4">Target Creator</label>
          
          {selectedCreator ? (
            <div className="relative animate-fade-in-up">
              <CreatorCard creator={selectedCreator} />
              <button 
                onClick={() => setSelectedCreator(null)}
                className="absolute -top-2 -right-2 bg-brand-pink hover:bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs shadow-md transition-all hover:scale-110"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          ) : (
             <div className="border-2 border-dashed border-brand-base rounded-xl p-8 text-center bg-brand-base/20">
                <p className="text-gray-400 text-sm mb-4">Select a creator from the list to analyze compatibility.</p>
                <div className="max-h-60 overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                  {availableCreators.map(c => (
                    <div 
                      key={c.id} 
                      onClick={() => setSelectedCreator(c)}
                      className="flex items-center gap-3 p-2 hover:bg-brand-base/50 rounded-lg cursor-pointer transition-colors text-left group"
                    >
                      <img src={c.avatarUrl} alt={c.name} className="w-8 h-8 rounded-full border border-transparent group-hover:border-brand-pink transition-colors object-cover" />
                      <div className="overflow-hidden">
                        <p className="text-sm font-medium text-gray-200 truncate group-hover:text-brand-pink transition-colors">{c.name}</p>
                        <p className="text-xs text-gray-500 truncate">{c.niche} • {c.subscribers}</p>
                      </div>
                    </div>
                  ))}
                </div>
             </div>
          )}
        </div>

        <button
          onClick={handleGenerate}
          disabled={!selectedCreator || isLoading}
          className={`
            w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all duration-300 flex items-center justify-center gap-2
            ${!selectedCreator || isLoading
              ? 'bg-brand-base text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-brand-pink to-brand-plum hover:from-brand-pink hover:to-brand-base text-white transform hover:scale-[1.02] active:scale-[0.98] shadow-brand-pink/30 hover:shadow-brand-pink/50'}
          `}
        >
          {isLoading ? (
            <>
              <i className="fas fa-spinner fa-spin"></i> Analyzing...
            </>
          ) : (
            <>
              <i className="fas fa-wand-magic-sparkles"></i> Generate Strategy
            </>
          )}
        </button>
      </div>

      {/* Right Column: Results */}
      <div className="lg:w-2/3">
        {strategy ? (
          <div className="space-y-6 animate-[fadeIn_0.5s_ease-in-out]">
            
            {/* Score Header */}
            <div className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center gap-8 border-t-4 border-t-brand-pink">
              <div className="relative">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle cx="64" cy="64" r="60" stroke="#5A0E24" strokeWidth="8" fill="transparent" />
                  <circle 
                    cx="64" cy="64" r="60" 
                    stroke={strategy.compatibilityScore > 80 ? '#C41E5D' : strategy.compatibilityScore > 50 ? '#69B3D8' : '#7D1B3A'} 
                    strokeWidth="8" 
                    fill="transparent" 
                    strokeDasharray={377}
                    strokeDashoffset={377 - (377 * strategy.compatibilityScore) / 100}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{strategy.compatibilityScore}%</span>
                  <span className="text-xs text-gray-400">Match</span>
                </div>
              </div>
              <div className="flex-1 text-center md:text-left">
                <h2 className="text-2xl font-bold text-white mb-2">Compatibility Analysis</h2>
                <p className="text-gray-300 italic">"{strategy.reasoning}"</p>
              </div>
            </div>

            {/* Pitch */}
            <div className="glass-panel p-6 rounded-xl">
               <h3 className="text-lg font-bold text-white mb-3 flex items-center gap-2">
                 <i className="fas fa-paper-plane text-brand-blue"></i> Outreach Pitch
               </h3>
               <div className="bg-brand-deep/60 p-4 rounded-lg border border-brand-base">
                 <p className="text-gray-200 leading-relaxed font-mono text-sm">"{strategy.pitch}"</p>
               </div>
               <button 
                 onClick={() => navigator.clipboard.writeText(strategy.pitch)}
                 className="mt-3 text-xs text-brand-blue hover:text-white flex items-center gap-1 transition-colors hover:scale-105"
               >
                 <i className="fas fa-copy"></i> Copy to clipboard
               </button>
            </div>

            {/* Ideas */}
            <div>
              <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <i className="fas fa-lightbulb text-yellow-400"></i> Collaboration Ideas
              </h3>
              <div className="grid gap-4">
                {strategy.ideas.map((idea, index) => (
                  <div key={index} className="glass-panel p-5 rounded-xl hover:bg-brand-base/80 transition-all hover:scale-[1.01] duration-200">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-bold text-brand-blue">{index + 1}. {idea.title}</h4>
                      <div className="flex items-center gap-1 text-xs bg-brand-deep px-2 py-1 rounded">
                        <i className="fas fa-fire text-brand-pink"></i>
                        <span className="text-gray-300">{idea.viralPotential}/100 Potential</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-400">{idea.description}</p>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-gray-600 min-h-[400px]">
            <div className="w-24 h-24 rounded-full bg-brand-base flex items-center justify-center mb-6 animate-float-slow">
              <i className="fas fa-robot text-4xl text-brand-plum"></i>
            </div>
            <h3 className="text-xl font-medium mb-2">Ready to Match</h3>
            <p className="text-center max-w-md">
              Fill in your details and select a creator to let Gemini analyze your synergy and generate content ideas.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Matchmaker;