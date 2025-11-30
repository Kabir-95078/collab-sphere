
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_CREATORS } from '../constants';
import CreatorCard from '../components/CreatorCard';
import { Creator, Platform } from '../types';
import { parseSubscribers } from '../utils/levelUtils';
import { fetchCreators, searchCreators } from '../services/creatorService';

interface DiscoverProps {
  onCollabRequest: (creator: Creator) => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ onCollabRequest, searchTerm = '', setSearchTerm }) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [defaultCreators, setDefaultCreators] = useState<Creator[]>([]); // Cache for default view
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Filters
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');

  // Extract unique filter options from displayed creators
  const niches = useMemo(() => ['All', ...Array.from(new Set(creators.map(c => c.niche)))].slice(0, 8), [creators]);
  const platforms = ['All', ...Object.values(Platform)];

  // Initial Load
  useEffect(() => {
    const loadInitialData = async () => {
      // Try to load from session storage first
      const cachedData = sessionStorage.getItem('collabsphere_discover_cache');
      
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        setCreators(parsed);
        setDefaultCreators(parsed);
        setLoading(false);
      } else {
        setLoading(true);
        try {
          // Start with Mocks + 12 fetched users
          const fetched = await fetchCreators(12);
          const combined = [...MOCK_CREATORS, ...fetched];
          // Dedupe
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          
          setCreators(unique);
          setDefaultCreators(unique);
          sessionStorage.setItem('collabsphere_discover_cache', JSON.stringify(unique));
        } catch (error) {
          console.error("Error loading creators", error);
          setCreators(MOCK_CREATORS);
          setDefaultCreators(MOCK_CREATORS);
        } finally {
          setLoading(false);
        }
      }
    };
    loadInitialData();
  }, []);

  // Search Effect
  useEffect(() => {
    if (!searchTerm || searchTerm.length < 3) {
        if (isSearching) {
            // Revert to default list if search is cleared
            setCreators(defaultCreators);
            setIsSearching(false);
        }
        return;
    }

    const performSearch = async () => {
        setLoading(true);
        setIsSearching(true);
        try {
            const results = await searchCreators(searchTerm);
            if (results.length > 0) {
                setCreators(results);
            }
        } catch (error) {
            console.error("Search error", error);
        } finally {
            setLoading(false);
        }
    };

    const debounce = setTimeout(performSearch, 600);
    return () => clearTimeout(debounce);
  }, [searchTerm]); // removed defaultCreators dependency to prevent loops, relying on ref/isSearching logic implicitly or simple state

  const handleLoadMore = async () => {
    if (isSearching) return; // Don't load random users into search results

    setLoadingMore(true);
    try {
      const moreCreators = await fetchCreators(8);
      const updated = [...creators, ...moreCreators];
      setCreators(updated);
      setDefaultCreators(updated); // Update default cache too
      sessionStorage.setItem('collabsphere_discover_cache', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingMore(false);
    }
  };

  // Client-side Filtering & Sorting
  const displayedCreators = useMemo(() => {
    let filtered = [...creators];

    // Niche Filter
    if (selectedNiche !== 'All') {
      filtered = filtered.filter(c => c.niche === selectedNiche);
    }

    // Platform Filter
    if (selectedPlatform !== 'All') {
      filtered = filtered.filter(c => c.platform === selectedPlatform);
    }

    // Sorting
    if (sortBy === 'subscribers') {
      filtered.sort((a, b) => parseSubscribers(b.subscribers) - parseSubscribers(a.subscribers));
    } else if (sortBy === 'fee_low') {
      filtered.sort((a, b) => a.collabFee - b.collabFee);
    } else if (sortBy === 'fee_high') {
      filtered.sort((a, b) => b.collabFee - a.collabFee);
    }

    return filtered;
  }, [creators, selectedNiche, selectedPlatform, sortBy]);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 min-h-full">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4 animate-[fadeIn_0.5s_ease-out]">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
             {isSearching ? `Results for "${searchTerm}"` : 'Discover Creators'}
          </h1>
          <p className="text-gray-400">
             {isSearching 
               ? 'AI-Generated real-world matches based on your search.' 
               : 'Find the perfect partner for your next collaboration.'}
          </p>
        </div>
        
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2 bg-brand-base/30 rounded-lg p-1 border border-brand-base/50">
           <span className="text-xs text-gray-400 px-2 uppercase tracking-wider">Sort By</span>
           <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-brand-deep text-white text-sm rounded-md p-2 border-none outline-none focus:ring-1 focus:ring-brand-pink cursor-pointer"
           >
              <option value="relevance">Relevance</option>
              <option value="subscribers">Subscribers (High to Low)</option>
              <option value="fee_low">Collab Fee (Low to High)</option>
              <option value="fee_high">Collab Fee (High to Low)</option>
           </select>
        </div>
      </div>

      {/* Advanced Filter Bar */}
      <div className="sticky top-0 z-30 bg-brand-deep/95 backdrop-blur-xl py-4 mb-6 -mx-4 px-4 md:-mx-10 md:px-10 border-b border-brand-base/50 transition-all duration-300">
         <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
             
             {/* Platform Toggles */}
             <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 custom-scrollbar">
                {platforms.map(p => (
                   <button
                      key={p}
                      onClick={() => setSelectedPlatform(p)}
                      className={`
                        px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                        ${selectedPlatform === p 
                           ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20 scale-105' 
                           : 'bg-brand-base/30 text-gray-400 hover:bg-brand-base hover:text-white'}
                      `}
                   >
                      {p === 'All' ? 'All Platforms' : p}
                   </button>
                ))}
             </div>

             {/* Niche Dropdown */}
             <div className="relative w-full md:w-64">
                <i className="fas fa-filter absolute left-3 top-1/2 transform -translate-y-1/2 text-brand-pink"></i>
                <select
                   value={selectedNiche}
                   onChange={(e) => setSelectedNiche(e.target.value)}
                   className="w-full bg-brand-base/20 border border-brand-base rounded-xl py-2.5 pl-10 pr-4 text-sm text-white appearance-none focus:outline-none focus:ring-2 focus:ring-brand-pink cursor-pointer hover:bg-brand-base/40 transition-colors"
                >
                   {niches.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                <i className="fas fa-chevron-down absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none"></i>
             </div>
         </div>
      </div>

      {/* Content Grid */}
      {loading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
               <div key={n} className="h-64 rounded-xl glass-panel animate-pulse flex items-center justify-center">
                  <i className="fas fa-circle-notch fa-spin text-brand-pink/50 text-3xl"></i>
               </div>
            ))}
         </div>
      ) : displayedCreators.length > 0 ? (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 animate-fade-in-up">
            {displayedCreators.map((creator, index) => (
               <div key={creator.id} style={{ animationDelay: `${index * 50}ms` }} className="animate-fade-in-up">
                  <CreatorCard 
                    creator={creator} 
                    onRequestCollab={onCollabRequest}
                  />
               </div>
            ))}
         </div>
      ) : (
         <div className="text-center py-20">
            <div className="w-24 h-24 bg-brand-base/20 rounded-full flex items-center justify-center mx-auto mb-4">
               <i className="fas fa-search text-3xl text-gray-500"></i>
            </div>
            <h3 className="text-xl font-bold text-white mb-2">No creators found</h3>
            <p className="text-gray-400">Try adjusting your filters or search term.</p>
            {isSearching && (
                <button 
                    onClick={() => { setSearchTerm && setSearchTerm(''); }}
                    className="mt-4 text-brand-pink hover:text-white underline"
                >
                    Clear Search
                </button>
            )}
         </div>
      )}

      {/* Load More Button - Only show if NOT searching and there are items */}
      {!loading && !isSearching && displayedCreators.length > 0 && (
         <div className="mt-12 text-center">
            <button
               onClick={handleLoadMore}
               disabled={loadingMore}
               className="bg-brand-base/50 hover:bg-brand-base text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed border border-brand-plum/30 flex items-center gap-2 mx-auto"
            >
               {loadingMore ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-plus"></i>}
               Load More Creators
            </button>
         </div>
      )}
    </div>
  );
};

export default Discover;
