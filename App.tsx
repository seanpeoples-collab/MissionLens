import React, { useState } from 'react';
import { Search, Loader2, Video, Sparkles } from 'lucide-react';
import { analyzeOrganization } from './services/geminiService';
import { AnalysisResult, AnalysisState } from './types';
import AnalysisDashboard from './components/AnalysisDashboard';

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<AnalysisState>(AnalysisState.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    setStatus(AnalysisState.LOADING);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeOrganization(searchTerm);
      setResult(data);
      setStatus(AnalysisState.SUCCESS);
    } catch (err: any) {
      console.error(err);
      setError("Unable to complete analysis. Please try again later or check your connection.");
      setStatus(AnalysisState.ERROR);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-2 rounded-lg">
               <Video className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
              MissionLens
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">How it Works</a>
            <a href="#" className="hover:text-indigo-600 transition-colors">Case Studies</a>
            <button className="text-indigo-600 hover:text-indigo-700">Login</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Search Hero Section (Only centered if no results yet) */}
        <div className={`transition-all duration-500 ease-in-out no-print ${status === AnalysisState.SUCCESS ? 'mb-10' : 'min-h-[60vh] flex flex-col justify-center items-center text-center'}`}>
          
          <div className={`${status === AnalysisState.SUCCESS ? 'w-full max-w-6xl flex justify-between items-end' : 'w-full max-w-2xl'}`}>
             <div className={`${status === AnalysisState.SUCCESS ? '' : 'mb-10'}`}>
                {status !== AnalysisState.SUCCESS && (
                  <>
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold mb-6 animate-fade-in">
                      <Sparkles className="w-4 h-4" />
                      <span>AI-Powered Client Prospecting</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                      Find Nonprofits with <br/>
                      <span className="text-indigo-600">Untapped Video Potential</span>
                    </h1>
                    <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto">
                      Audit nonprofits, public institutions, and mission-driven orgs to identify weak video strategies and generate the perfect pitch.
                    </p>
                  </>
                )}
             </div>

             <form onSubmit={handleSearch} className={`relative group ${status === AnalysisState.SUCCESS ? 'w-full max-w-md' : 'w-full max-w-xl mx-auto'}`}>
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className={`w-5 h-5 ${status === AnalysisState.LOADING ? 'text-indigo-400' : 'text-slate-400'}`} />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Enter nonprofit name (e.g. 'Local Food Bank')"
                  className="w-full pl-11 pr-4 py-4 bg-white border border-slate-200 rounded-xl shadow-lg shadow-slate-200/50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-base disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={status === AnalysisState.LOADING}
                />
                <div className="absolute inset-y-0 right-2 flex items-center">
                  <button 
                    type="submit"
                    disabled={status === AnalysisState.LOADING || !searchTerm.trim()}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-lg transition-colors disabled:bg-indigo-300"
                  >
                     {status === AnalysisState.LOADING ? (
                       <Loader2 className="w-5 h-5 animate-spin" />
                     ) : (
                       <span className="text-sm font-semibold px-2">Analyze</span>
                     )}
                  </button>
                </div>
             </form>
          </div>
        </div>

        {/* Content Area */}
        <div className="w-full">
           {status === AnalysisState.ERROR && (
             <div className="max-w-2xl mx-auto bg-red-50 border border-red-100 rounded-xl p-6 text-center">
                <p className="text-red-600 font-medium">{error}</p>
                <button 
                  onClick={() => setStatus(AnalysisState.IDLE)}
                  className="mt-4 text-sm text-red-700 underline hover:text-red-800"
                >
                  Try again
                </button>
             </div>
           )}

           {status === AnalysisState.LOADING && (
              <div className="max-w-2xl mx-auto text-center py-12">
                 <div className="inline-block relative">
                    <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin"></div>
                 </div>
                 <h3 className="mt-6 text-xl font-bold text-slate-800">Auditing {searchTerm}...</h3>
                 <p className="text-slate-500 mt-2">Scanning social channels for strategy gaps and opportunities.</p>
                 
                 <div className="mt-8 max-w-sm mx-auto space-y-3">
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden w-full">
                       <div className="h-full bg-indigo-500 w-1/3 animate-pulse"></div>
                    </div>
                    <div className="flex justify-between text-xs text-slate-400">
                       <span>Discovery</span>
                       <span>Analysis</span>
                       <span>Strategy</span>
                    </div>
                 </div>
              </div>
           )}

           {status === AnalysisState.SUCCESS && result && (
             <AnalysisDashboard data={result} />
           )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-24 py-12 no-print">
         <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} MissionLens. Powered by Gemini Pro.</p>
         </div>
      </footer>
    </div>
  );
};

export default App;