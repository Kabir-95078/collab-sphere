
import React, { useState } from 'react';
import { generateVideoScript, generateThumbnailConcepts } from '../services/geminiService';
import { ScriptResponse, ThumbnailConcept } from '../types';

const CreativeStudio: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'script' | 'thumbnail'>('script');
  
  // Script State
  const [scriptTopic, setScriptTopic] = useState('');
  const [scriptTone, setScriptTone] = useState('Energetic & Fast-Paced');
  const [scriptDuration, setScriptDuration] = useState('8-10 minutes');
  const [generatedScript, setGeneratedScript] = useState<ScriptResponse | null>(null);
  const [isScriptLoading, setIsScriptLoading] = useState(false);

  // Thumbnail State
  const [thumbTopic, setThumbTopic] = useState('');
  const [thumbVibe, setThumbVibe] = useState('High Contrast & Clickbaity');
  const [generatedConcepts, setGeneratedConcepts] = useState<ThumbnailConcept[]>([]);
  const [isThumbLoading, setIsThumbLoading] = useState(false);

  const handleScriptGenerate = async () => {
    if (!scriptTopic) return;
    setIsScriptLoading(true);
    setGeneratedScript(null);
    try {
      const result = await generateVideoScript(scriptTopic, scriptTone, scriptDuration);
      setGeneratedScript(result);
    } catch (e) {
      alert("Failed to generate script. Please try again.");
    } finally {
      setIsScriptLoading(false);
    }
  };

  const handleThumbGenerate = async () => {
    if (!thumbTopic) return;
    setIsThumbLoading(true);
    setGeneratedConcepts([]);
    try {
      const result = await generateThumbnailConcepts(thumbTopic, thumbVibe);
      setGeneratedConcepts(result);
    } catch (e) {
      alert("Failed to generate thumbnail concepts.");
    } finally {
      setIsThumbLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto pb-24 md:pb-10 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Creative Studio</h1>
        <p className="text-gray-400">AI-powered tools to accelerate your production workflow.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('script')}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'script' 
            ? 'bg-brand-pink text-white shadow-lg shadow-brand-pink/20 scale-105' 
            : 'glass-panel text-gray-400 hover:text-white'
          }`}
        >
          <i className="fas fa-file-alt"></i> Script Writer
        </button>
        <button 
          onClick={() => setActiveTab('thumbnail')}
          className={`px-6 py-3 rounded-xl font-bold transition-all flex items-center gap-2 ${
            activeTab === 'thumbnail' 
            ? 'bg-brand-blue text-brand-deep shadow-lg shadow-brand-blue/20 scale-105' 
            : 'glass-panel text-gray-400 hover:text-white'
          }`}
        >
          <i className="fas fa-image"></i> Thumbnail Architect
        </button>
      </div>

      {/* SCRIPT WRITER TAB */}
      {activeTab === 'script' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
          {/* Controls */}
          <div className="lg:col-span-1 space-y-6">
            <div className="glass-panel p-6 rounded-xl">
               <h3 className="font-bold text-white mb-4">Script Parameters</h3>
               
               <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Video Topic</label>
                    <input 
                      type="text" 
                      value={scriptTopic}
                      onChange={(e) => setScriptTopic(e.target.value)}
                      className="w-full bg-brand-deep border border-brand-base rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                      placeholder="e.g., iPhone 16 Review"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Tone & Style</label>
                    <select 
                      value={scriptTone}
                      onChange={(e) => setScriptTone(e.target.value)}
                      className="w-full bg-brand-deep border border-brand-base rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                    >
                      <option>Energetic & Fast-Paced</option>
                      <option>Professional & Educational</option>
                      <option>Relaxed & Vlog-style</option>
                      <option>Humorous & Sarcastic</option>
                      <option>Cinematic & Story-driven</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Target Duration</label>
                    <select 
                      value={scriptDuration}
                      onChange={(e) => setScriptDuration(e.target.value)}
                      className="w-full bg-brand-deep border border-brand-base rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-pink"
                    >
                      <option>Under 60 seconds (Shorts)</option>
                      <option>3-5 minutes</option>
                      <option>8-10 minutes</option>
                      <option>15+ minutes (Deep Dive)</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleScriptGenerate}
                    disabled={!scriptTopic || isScriptLoading}
                    className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2
                      ${!scriptTopic || isScriptLoading 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-brand-pink hover:bg-brand-plum text-white hover:scale-105 active:scale-95'}
                    `}
                  >
                    {isScriptLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-magic"></i>}
                    Generate Script
                  </button>
               </div>
            </div>
            
            <div className="glass-panel p-6 rounded-xl bg-brand-base/20 border-brand-blue/30">
               <h4 className="font-bold text-brand-blue mb-2"><i className="fas fa-lightbulb"></i> Pro Tip</h4>
               <p className="text-sm text-gray-300">
                  Be specific with your topic! Instead of "Cooking", try "How to make authentic pasta carbonara in 15 minutes".
               </p>
            </div>
          </div>

          {/* Output */}
          <div className="lg:col-span-2">
            {generatedScript ? (
              <div className="glass-panel p-8 rounded-xl min-h-[500px] border border-brand-pink/30 relative">
                <button 
                  onClick={() => copyToClipboard(JSON.stringify(generatedScript, null, 2))}
                  className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors"
                  title="Copy to Clipboard"
                >
                  <i className="far fa-copy"></i>
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 border-b border-brand-base pb-4">
                   {generatedScript.title}
                </h2>

                <div className="space-y-6">
                   <div className="bg-brand-deep/50 p-4 rounded-lg border-l-4 border-yellow-500">
                      <span className="text-xs font-bold text-yellow-500 uppercase tracking-wider block mb-1">Hook ({generatedScript.estimatedDuration})</span>
                      <p className="text-gray-200">{generatedScript.hook}</p>
                   </div>

                   {generatedScript.sections.map((section, idx) => (
                      <div key={idx} className="bg-brand-deep/30 p-4 rounded-lg">
                         <div className="flex justify-between mb-2">
                            <h4 className="font-bold text-brand-blue">{section.heading}</h4>
                            <span className="text-xs text-gray-500">{section.duration}</span>
                         </div>
                         <p className="text-gray-300 whitespace-pre-wrap">{section.content}</p>
                      </div>
                   ))}

                   <div className="bg-brand-pink/10 p-4 rounded-lg border border-brand-pink/30">
                      <span className="text-xs font-bold text-brand-pink uppercase tracking-wider block mb-1">Call to Action</span>
                      <p className="text-white font-medium">{generatedScript.callToAction}</p>
                   </div>
                </div>

              </div>
            ) : (
              <div className="h-full glass-panel rounded-xl flex flex-col items-center justify-center text-center p-10 min-h-[400px]">
                <div className="w-20 h-20 bg-brand-base rounded-full flex items-center justify-center mb-6 animate-pulse-glow">
                   <i className="fas fa-pen-nib text-3xl text-brand-pink"></i>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Writer's Block? Not anymore.</h3>
                <p className="text-gray-400 max-w-md">Enter your video details on the left and let our AI structure your next viral hit.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* THUMBNAIL ARCHITECT TAB */}
      {activeTab === 'thumbnail' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fade-in-up">
           {/* Controls */}
           <div className="lg:col-span-1 space-y-6">
             <div className="glass-panel p-6 rounded-xl">
               <h3 className="font-bold text-white mb-4">Thumbnail Params</h3>
               
               <div className="space-y-4">
                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Video Concept</label>
                    <input 
                      type="text" 
                      value={thumbTopic}
                      onChange={(e) => setThumbTopic(e.target.value)}
                      className="w-full bg-brand-deep border border-brand-base rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                      placeholder="e.g., Surviving 24 Hours in the Desert"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-gray-400 block mb-1">Visual Vibe</label>
                    <select 
                      value={thumbVibe}
                      onChange={(e) => setThumbVibe(e.target.value)}
                      className="w-full bg-brand-deep border border-brand-base rounded-lg p-3 text-white focus:outline-none focus:ring-1 focus:ring-brand-blue"
                    >
                      <option>High Contrast & Clickbaity</option>
                      <option>Minimalist & Aesthetic</option>
                      <option>Dark & Mysterious</option>
                      <option>Bright & Cheerful</option>
                      <option>Chaotic & Intense</option>
                    </select>
                  </div>

                  <button 
                    onClick={handleThumbGenerate}
                    disabled={!thumbTopic || isThumbLoading}
                    className={`w-full py-3 rounded-xl font-bold shadow-lg transition-all flex items-center justify-center gap-2
                      ${!thumbTopic || isThumbLoading 
                      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                      : 'bg-brand-blue hover:bg-blue-400 text-brand-deep hover:scale-105 active:scale-95'}
                    `}
                  >
                    {isThumbLoading ? <i className="fas fa-circle-notch fa-spin"></i> : <i className="fas fa-paint-brush"></i>}
                    Visualize Ideas
                  </button>
               </div>
             </div>
           </div>

           {/* Output */}
           <div className="lg:col-span-2">
              {generatedConcepts.length > 0 ? (
                 <div className="grid gap-6">
                    {generatedConcepts.map((concept, idx) => (
                       <div key={idx} className="glass-panel p-0 rounded-xl overflow-hidden flex flex-col md:flex-row animate-fade-in-up" style={{ animationDelay: `${idx * 150}ms` }}>
                          
                          {/* Visual Representation Placeholder */}
                          <div className="md:w-1/3 bg-brand-deep relative min-h-[200px] md:min-h-full p-4 flex items-center justify-center border-r border-brand-base">
                             <div className="text-center">
                                <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">Composition</div>
                                <div className="w-full aspect-video bg-gray-800 rounded border border-gray-600 relative overflow-hidden group">
                                   {/* Abstract Shapes representing layout */}
                                   <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-600 text-4xl">
                                      <i className="fas fa-image"></i>
                                   </div>
                                   {/* Text Overlay Mock */}
                                   <div className="absolute bottom-2 right-2 bg-red-600 text-white text-[8px] px-1 font-bold rounded">
                                      {concept.textOverlay}
                                   </div>
                                </div>
                                <p className="text-xs text-brand-blue mt-3 font-medium">{concept.colorVibe}</p>
                             </div>
                          </div>

                          <div className="md:w-2/3 p-6">
                             <h3 className="text-xl font-bold text-white mb-2">{concept.conceptName}</h3>
                             <p className="text-gray-300 text-sm mb-4 leading-relaxed">{concept.visualDescription}</p>
                             
                             <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-brand-base/20 p-3 rounded-lg border border-brand-base">
                                   <span className="text-xs text-gray-400 uppercase block">Text Overlay</span>
                                   <span className="text-brand-pink font-bold font-mono">"{concept.textOverlay}"</span>
                                </div>
                                <div className="bg-brand-base/20 p-3 rounded-lg border border-brand-base">
                                   <span className="text-xs text-gray-400 uppercase block">Psychology</span>
                                   <span className="text-white text-xs">{concept.whyItWorks}</span>
                                </div>
                             </div>
                          </div>
                       </div>
                    ))}
                 </div>
              ) : (
                 <div className="h-full glass-panel rounded-xl flex flex-col items-center justify-center text-center p-10 min-h-[400px]">
                   <div className="w-20 h-20 bg-brand-deep rounded-full border-2 border-brand-blue flex items-center justify-center mb-6 animate-pulse">
                      <i className="fas fa-eye text-3xl text-brand-blue"></i>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">Visualize the Click</h3>
                   <p className="text-gray-400 max-w-md">Describe your video and get 3 high-CTR thumbnail concepts powered by Gemini.</p>
                 </div>
              )}
           </div>
        </div>
      )}

    </div>
  );
};

export default CreativeStudio;
