
import React, { useState, useEffect, useMemo } from 'react';
import { MOCK_CREATORS } from '../constants';
import CreatorCard from '../components/CreatorCard';
import { Creator, Platform } from '../types';
import { parseSubscribers } from '../utils/levelUtils';
import { fetchCreators } from '../services/creatorService';

interface DiscoverProps {
  onCollabRequest: (creator: Creator) => void;
  searchTerm?: string;
  setSearchTerm?: (term: string) => void;
}

const Discover: React.FC<DiscoverProps> = ({ onCollabRequest, searchTerm = '', setSearchTerm }) => {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  
  // Filters
  const [selectedNiche, setSelectedNiche] = useState('All');
  const [selectedPlatform, setSelectedPlatform] = useState('All');
  const [selectedTag, setSelectedTag] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');

  // Initial Load with Caching Strategy
  useEffect(() => {
    const loadInitialData = async () => {
      // Try to load from session storage first to maintain state across tab switches
      const cachedData = sessionStorage.getItem('collabsphere_discover_cache');
      
      if (cachedData) {
        setCreators(JSON.parse(cachedData));
        setLoading(false);
      } else {
        setLoading(true);
        try {
          // Start with Mocks + 12 fetched users
          const fetched = await fetchCreators(12);
          // Combine and deduplicate based on ID just in case
          const combined = [...MOCK_CREATORS, ...fetched];
          const unique = Array.from(new Map(combined.map(item => [item.id, item])).values());
          
          setCreators(unique);
          sessionStorage.setItem('collabsphere_discover_cache', JSON.stringify(unique));
        } catch (error) {
          console.error("Error loading creators", error);
          setCreators(MOCK_CREATORS);
        } finally {
          setLoading(false);
        }
      }
    };
    loadInitialData();
  }, []);

  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const moreCreators = await fetchCreators(8);
      setCreators(prev => {
        const updated = [...prev, ...moreCreators];
        // Update cache
        sessionStorage.setItem('collabsphere_discover_cache', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Error loading more creators", error);
    } finally {
      setLoadingMore(false);
    }
  };

  // Derive unique options dynamically from current data
  const niches = useMemo(() => ['All', ...Array.from(new Set(creators.map(c => c.niche))).sort()], [creators]);
  const tags = useMemo(() => {
    const allTags = creators.flatMap(c => c.tags);
    return ['All', ...Array.from(new Set(allTags)).sort()];
  }, [creators]);

  const filteredCreators = useMemo(() => {
    let result = creators.filter(c => {
      // 1. Search Term Filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = 
        c.name.toLowerCase().includes(searchLower) ||
        c.niche.toLowerCase().includes(searchLower) ||
        c.tags.some(t => t.toLowerCase().includes(searchLower));
      
      // 2. Dropdown Filters
      const matchesNiche = selectedNiche === 'All' || c.niche === selectedNiche;
      const matchesPlatform = selectedPlatform === 'All' || c.platform === selectedPlatform;
      const matchesTag = selectedTag === 'All' || c.tags.includes(selectedTag);

      return matchesSearch && matchesNiche && matchesPlatform && matchesTag;
    });

    // 3. Sorting Logic
    // Create a copy to avoid mutating the original filtered array if React re-uses it
    result = [...result];
    
    if (sortBy === 'subs_high') {
      result.sort((a, b) => parseSubscribers(b.subscribers) - parseSubscribers(a.subscribers));
    } else if (sortBy === 'subs_low') {
      result.sort((a, b) => parseSubscribers(a.subscribers) - parseSubscribers(b.subscribers));
    } else if (sortBy === 'fee_high') {
      result.sort((a, b) => b.collabFee - a.collabFee);
    } else if (sortBy === 'fee_low') {
      result.sort((a, b) => a.collabFee - b.collabFee);
    }
    // 'relevance' keeps original order (which is Mocks then Fetched)

    return result;
  }, [creators, searchTerm, selectedNiche, selectedPlatform, selectedTag, sortBy]);

  const clearFilters = () => {
    setSelectedNiche('All');
    setSelectedPlatform('All');
    setSelectedTag('All');
    setSortBy('relevance');
    if (setSearchTerm) setSearchTerm('');
  };

  const activeFiltersCount = [
    selectedNiche !== 'All',
    selectedPlatform !== 'All',
    selectedTag !== 'All',
    sortBy !== 'relevance'
  ].filter(Boolean).length;

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 animate-[fadeIn_0.5s_ease-out]">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Discover Creators</h1>
          <p className="text-gray-400">Find the perfect partner from our database of top talent.</p>
        </div>
        
        {/* Mobile Search Fallback - Visible only on small screens where header search might be hidden/smaller */}
        <div className="relative w-full md:w-80 md:hidden">
          <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm && setSearchTerm(e.target.value)}
            className="w-full bg-brand-deep/50 border border-brand-base text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-brand-pink transition-all placeholder-gray-600"
          />
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-panel p-4 rounded-xl mb-8 border border-brand-base/50">
        <div className="flex flex-col xl:flex-row gap-4 justify-between items-start xl:items-center">
          
          {/* Filters Group */}
          <div className="flex flex-wrap gap-3 w-full xl:w-auto">
            
            {/* Platform Filter */}
            <div className="relative group flex-1 md:flex-none min-w-[140px]">
               <select 
                 value={selectedPlatform}
                 onChange={(e) => setSelectedPlatform(e.target.value)}
                 className="w-full appearance-none bg-brand-deep/60 border border-brand-base text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-brand-pink cursor-pointer hover:bg-brand-base/40 transition-colors"
               >
                 <option value="All">All Platforms</option>
                 {Object.values(Platform).map(p => (
                   <option key={p} value={p}>{p}</option>
                 ))}
               </select>
               <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none group-hover:text-brand-pink transition-colors"></i>
            </div>

            {/* Niche Filter */}
            <div className="relative group flex-1 md:flex-none min-w-[140px]">
               <select 
                 value={selectedNiche}
                 onChange={(e) => setSelectedNiche(e.target.value)}
                 className="w-full appearance-none bg-brand-deep/60 border border-brand-base text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-brand-pink cursor-pointer hover:bg-brand-base/40 transition-colors"
               >
                 <option value="All">All Niches</option>
                 {niches.map(n => (
                   <option key={n} value={n}>{n}</option>
                 ))}
               </select>
               <i className="fas fa-chevron-down absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none group-hover:text-brand-pink transition-colors"></i>
            </div>

            {/* Tags Filter */}
            <div className="relative group flex-1 md:flex-none min-w-[140px]">
               <select 
                 value={selectedTag}
                 onChange={(e) => setSelectedTag(e.target.value)}
                 className="w-full appearance-none bg-brand-deep/60 border border-brand-base text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-brand-pink cursor-pointer hover:bg-brand-base/40 transition-colors"
               >
                 <option value="All">All Tags</option>
                 {tags.map(t => (
                   <option key={t} value={t}>{t}</option>
                 ))}
               </select>
               <i className="fas fa-tag absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 pointer-events-none group-hover:text-brand-pink transition-colors"></i>
            </div>
          </div>

          {/* Sort & Stats Group */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full xl:w-auto justify-between xl:justify-end border-t xl:border-t-0 border-brand-base/30 pt-4 xl:pt-0">
             
             <div className="text-xs text-gray-400">
                Showing <span className="font-bold text-white">{filteredCreators.length}</span> creators
             </div>

             <div className="flex items-center gap-3 w-full md:w-auto">
                <span className="text-xs text-gray-500 uppercase font-medium whitespace-nowrap">Sort:</span>
                <div className="relative group w-full md:w-48">
                   <select 
                     value={sortBy}
                     onChange={(e) => setSortBy(e.target.value)}
                     className="w-full appearance-none bg-brand-base text-white text-sm rounded-lg pl-3 pr-8 py-2 focus:outline-none focus:ring-1 focus:ring-brand-pink cursor-pointer hover:bg-brand-plum transition-colors font-medium shadow-lg"
                   >
                     <option value="relevance">Relevance</option>
                     <option value="subs_high">Subscribers (High)</option>
                     <option value="subs_low">Subscribers (Low)</option>
                     <option value="fee_high">Fee (High)</option>
                     <option value="fee_low">Fee (Low)</option>
                   </select>
                   <i className="fas fa-sort absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-white pointer-events-none"></i>
                </div>
                
                {activeFiltersCount > 0 && (
                   <button 
                     onClick={clearFilters}
                     className="text-xs text-brand-pink hover:text-white underline ml-2 transition-colors whitespace-nowrap"
                   >
                     Reset
                   </button>
                )}
             </div>
          </div>

        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {[...Array(6)].map((_, i) => (
             <div key={i} className="glass-panel h-64 rounded-xl animate-pulse flex flex-col p-5">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-brand-base/50 rounded-full"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-brand-base/50 rounded w-3/4"></div>
                    <div className="h-3 bg-brand-base/30 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="h-3 bg-brand-base/30 rounded w-full mb-2"></div>
                <div className="h-3 bg-brand-base/30 rounded w-2/3"></div>
             </div>
           ))}
        </div>
      )}

      {/* Grid */}
      {!loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCreators.map((creator, index) => (
            <div 
               key={creator.id} 
               className="relative group animate-fade-in-up z-0 hover:z-10"
               style={{ animationDelay: `${(index % 9) * 100}ms` }}
            >
               <CreatorCard creator={creator} />
               <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 z-20">
                  <button 
                    onClick={() => onCollabRequest(creator)}
                    className="bg-brand-pink hover:bg-brand-plum text-white text-xs font-bold py-2 px-3 rounded-lg shadow-lg transition-all hover:scale-110 active:scale-95 duration-200 border border-brand-pink/50"
                  >
                    Request Collab
                  </button>
               </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Empty State */}
      {!loading && filteredCreators.length === 0 && (
        <div className="text-center py-20 animate-pulse glass-panel rounded-xl border-dashed border-2 border-brand-base/50">
          <div className="text-6xl text-brand-base mb-4 animate-float"><i className="fas fa-search"></i></div>
          <h3 className="text-xl font-bold text-white mb-2">No creators found</h3>
          <p className="text-gray-500 text-lg mb-6">Try adjusting your filters or search term.</p>
          <button 
             onClick={clearFilters}
             className="bg-brand-base hover:bg-brand-plum text-white px-6 py-2 rounded-lg font-medium transition-all"
          >
             Clear All Filters
          </button>
        </div>
      )}

      {/* Load More Button */}
      {!loading && filteredCreators.length > 0 && (
        <div className="flex justify-center mt-12">
           <button 
              onClick={handleLoadMore}
              disabled={loadingMore}
              className="bg-gradient-to-r from-brand-base to-brand-plum hover:from-brand-pink hover:to-brand-base text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition-all hover:scale-105 active:scale-95 flex items-center gap-2"
           >
              {loadingMore ? (
                 <>
                   <i className="fas fa-circle-notch fa-spin"></i> Fetching Data...
                 </>
              ) : (
                 <>
                   Load More Creators <i className="fas fa-cloud-download-alt"></i>
                 </>
              )}
           </button>
        </div>
      )}
    </div>
  );
};

export default Discover;
