import React from 'react';
import { AnalysisResult } from '../types';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown,
  Minus,
  ExternalLink,
  Target,
  MessageSquare,
  Lightbulb,
  Linkedin,
  Instagram,
  Facebook,
  Youtube,
  Twitter,
  Video,
  Globe,
  Share2,
  Clock,
  AlertCircle,
  Copy,
  Search,
  CheckCircle,
  XCircle,
  Download,
  FileText,
  Printer
} from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

const getPlatformIcon = (name: string) => {
  const lower = name.toLowerCase();
  if (lower.includes('linkedin')) return <Linkedin className="w-5 h-5" />;
  if (lower.includes('instagram')) return <Instagram className="w-5 h-5" />;
  if (lower.includes('facebook')) return <Facebook className="w-5 h-5" />;
  if (lower.includes('youtube')) return <Youtube className="w-5 h-5" />;
  if (lower.includes('twitter') || lower.includes('x')) return <Twitter className="w-5 h-5" />;
  if (lower.includes('tiktok')) return <Video className="w-5 h-5" />;
  if (lower.includes('website') || lower.includes('site')) return <Globe className="w-5 h-5" />;
  return <Share2 className="w-5 h-5" />;
};

const getTrendIcon = (trend: string | undefined) => {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-rose-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Strong': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case 'Average': return 'bg-amber-100 text-amber-700 border-amber-200';
    case 'Weak': return 'bg-rose-100 text-rose-700 border-rose-200';
    case 'Missing': return 'bg-slate-100 text-slate-500 border-slate-200';
    default: return 'bg-slate-100 text-slate-700 border-slate-200';
  }
};

const getSmartLink = (url: string | undefined | null, platformName: string, orgName: string) => {
  if (url && url.length > 5 && !url.includes('null')) {
    return { href: url, label: 'View Channel', icon: <ExternalLink className="w-3 h-3" /> };
  }
  const query = encodeURIComponent(`${orgName} ${platformName}`);
  return { 
    href: `https://www.google.com/search?q=${query}`, 
    label: `Find on ${platformName}`, 
    icon: <Search className="w-3 h-3" /> 
  };
};

const getScoreMeta = (score: number) => {
  if (score >= 80) return { label: 'Industry Leader', color: 'text-emerald-600', bg: 'bg-emerald-50', borderColor: 'border-emerald-100' };
  if (score >= 60) return { label: 'Strong Performance', color: 'text-indigo-600', bg: 'bg-indigo-50', borderColor: 'border-indigo-100' };
  if (score >= 40) return { label: 'Average', color: 'text-amber-600', bg: 'bg-amber-50', borderColor: 'border-amber-100' };
  return { label: 'Needs Improvement', color: 'text-rose-600', bg: 'bg-rose-50', borderColor: 'border-rose-100' };
};

const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  
  const chartData = [
    { name: 'Current', score: data.estimatedImpactScore },
    { name: 'Goal', score: 95 },
  ];

  const email = data.strategy.emailFramework;
  const scoreMeta = getScoreMeta(data.estimatedImpactScore);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const content = `
MISSIONLENS STRATEGY REPORT
Organization: ${data.organizationName}
Date: ${new Date().toLocaleDateString()}
Impact Score: ${data.estimatedImpactScore}/100

EXECUTIVE SUMMARY
${data.summary}

CRITICAL GAPS
${data.weaknesses.map(w => `- ${w}`).join('\n')}

PLATFORM AUDIT
${data.platforms.map(p => `
${p.name.toUpperCase()} (${p.status})
Strategy: ${p.contentStrategy}
Verdict: ${p.auditSnippet}
`).join('\n')}

COLD OUTREACH PLAYBOOK
Subject: ${email.subjectLine}
Hook: ${email.hook}
Problem: ${email.problem}
Solution: ${email.solution}
CTA: ${email.cta}

RECOMMENDATIONS
${data.strategy.improvementIdeas.map((idea, i) => `${i+1}. ${idea}`).join('\n')}
    `.trim();

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${data.organizationName.replace(/\s+/g, '_')}_Video_Strategy.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 animate-fade-in-up pb-20">
      
      {/* Header Section */}
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-800">{data.organizationName}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            <span className="text-slate-500 text-lg">Video Strategy Audit</span>
            {data.estimatedImpactScore < 50 && (
              <span className="flex items-center gap-1 text-xs font-medium bg-rose-100 text-rose-800 px-2 py-1 rounded-full border border-rose-200">
                <AlertCircle className="w-3 h-3" />
                High Opportunity Client
              </span>
            )}
             {data.estimatedImpactScore >= 80 && (
              <span className="flex items-center gap-1 text-xs font-medium bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full border border-emerald-200">
                <CheckCircle className="w-3 h-3" />
                Already Optimized
              </span>
            )}
          </div>
        </div>
        
        <div className="flex flex-col-reverse md:flex-col items-end gap-4 w-full md:w-auto">
           {/* Actions */}
           <div className="flex items-center gap-2 no-print">
             <button 
                onClick={handleDownloadTxt}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors border border-slate-200"
                title="Download as Text File"
              >
               <FileText className="w-4 h-4" />
               <span className="hidden sm:inline">Save Brief</span>
             </button>
             <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-sm shadow-indigo-200"
                title="Save as PDF (via Print)"
              >
               <Printer className="w-4 h-4" />
               <span className="hidden sm:inline">Save PDF</span>
             </button>
           </div>

           {/* Score Card */}
           <div className={`flex flex-col items-end px-5 py-3 rounded-2xl border ${scoreMeta.bg} ${scoreMeta.borderColor} border-opacity-60`}>
             <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-0.5">Impact Score</span>
             <div className="flex items-baseline gap-1.5">
               <span className={`text-4xl font-extrabold ${scoreMeta.color}`}>{data.estimatedImpactScore}</span>
               <span className="text-sm font-semibold text-slate-400">/100</span>
             </div>
             <span className={`text-xs font-bold mt-1 ${scoreMeta.color}`}>{scoreMeta.label}</span>
           </div>
        </div>
      </div>

      {/* Summary & Metrics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Executive Summary */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
            <Target className="w-5 h-5 text-indigo-500" />
            <h3 className="text-lg font-semibold text-slate-800">Executive Summary</h3>
          </div>
          <p className="text-slate-600 leading-relaxed text-base flex-grow">
            {data.summary}
          </p>
          
          <div className="mt-6 pt-4 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Critical Gaps</h4>
            <div className="flex flex-wrap gap-2">
              {data.weaknesses.map((weakness, idx) => (
                <span key={idx} className="bg-rose-50 text-rose-700 px-3 py-1 rounded-full text-sm font-medium border border-rose-100 flex items-center gap-1">
                  <XCircle className="w-3 h-3" /> {weakness}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Impact Potential & Stats */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-4 flex items-center gap-2 border-b border-slate-100 pb-4">
             <TrendingUp className="w-5 h-5 text-emerald-500" />
             <h3 className="text-lg font-semibold text-slate-800">Impact Potential</h3>
          </div>

          <div className="flex-grow flex flex-col gap-6">
            {/* Chart */}
            <div className="h-32 w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} layout="vertical" margin={{ left: 0, right: 20, top: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                    <XAxis type="number" domain={[0, 100]} hide />
                    <YAxis dataKey="name" type="category" width={60} tick={{fontSize: 12}} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#6366f1' : '#10b981'} />
                      ))}
                    </Bar>
                  </BarChart>
               </ResponsiveContainer>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 mt-auto">
               {data.metrics.slice(0, 4).map((m, i) => (
                 <div key={i} className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                   <div className="text-xs text-slate-500 mb-1 truncate" title={m.label}>{m.label}</div>
                   <div className="flex items-center gap-2">
                     <span className="text-lg font-bold text-slate-800 truncate" title={String(m.value)}>{m.value}</span>
                     {getTrendIcon(m.trend)}
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* Public Channel Audit */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 break-inside-avoid">
        <div className="mb-6 flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-500" />
          <h3 className="text-lg font-semibold text-slate-800">Public Channel Audit</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {data.platforms.map((platform, idx) => {
            const linkData = getSmartLink(platform.url, platform.name, data.organizationName);
            const isMissing = platform.status === 'Missing';
            
            return (
              <div key={idx} className={`rounded-xl p-5 border transition-all duration-200 flex flex-col h-full break-inside-avoid ${isMissing ? 'bg-slate-50 border-slate-100 opacity-70' : 'bg-white border-slate-200 hover:border-indigo-200 hover:shadow-md'}`}>
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-2 text-slate-700 font-bold">
                    {getPlatformIcon(platform.name)}
                    <span className="truncate max-w-[120px]" title={platform.name}>{platform.name}</span>
                  </div>
                  <span className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full border font-bold ${getStatusColor(platform.status)}`}>
                    {platform.status}
                  </span>
                </div>
                
                <div className="flex-grow space-y-3">
                   {!isMissing ? (
                     <>
                       {platform.auditSnippet && (
                         <div className="bg-slate-50 p-2 rounded-lg border border-slate-100">
                            <p className="text-xs font-semibold text-slate-700 italic">"{platform.auditSnippet}"</p>
                         </div>
                       )}
                       
                       <div className="space-y-1">
                         <div className="text-xs text-slate-500">
                            <span className="font-semibold text-slate-600">Strategy:</span> {platform.contentStrategy}
                         </div>
                         {platform.followerCount && (
                            <div className="text-xs text-slate-500">
                              <span className="font-semibold text-slate-600">Followers:</span> {platform.followerCount}
                            </div>
                         )}
                       </div>

                       {platform.lastActivityDate && (
                         <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-2">
                            <Clock className="w-3 h-3 text-slate-400" />
                            <span className={platform.status === 'Weak' ? 'text-rose-600 font-semibold' : 'text-slate-600'}>
                               Active: {platform.lastActivityDate}
                            </span>
                         </div>
                       )}
                     </>
                   ) : (
                     <div className="flex flex-col items-center justify-center h-full py-4 text-center">
                       <p className="text-xs text-slate-400 italic">No public official channel found.</p>
                     </div>
                   )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 no-print">
                  <a href={linkData.href} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-800 hover:underline font-bold transition-colors">
                    {linkData.label} {linkData.icon}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Strategy & Pitch Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 break-inside-avoid">
        
        {/* Cold Email Framework */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-slate-800">Cold Outreach Playbook</h3>
          </div>
          
          <div className="space-y-5">
            <div className="bg-slate-50 rounded-xl border border-slate-200 p-4 hover:border-blue-200 transition-colors cursor-pointer group">
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Subject Line</span>
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-blue-500 transition-colors no-print" />
              </div>
              <p className="text-slate-800 font-medium text-sm">{email.subjectLine}</p>
            </div>

            <div className="space-y-4 pl-2">
              <div className="relative border-l-2 border-slate-200 pl-4 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">The Hook</span>
                <p className="text-slate-600 text-sm leading-relaxed">{email.hook}</p>
              </div>
              <div className="relative border-l-2 border-slate-200 pl-4 pb-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">The Problem</span>
                <p className="text-slate-600 text-sm leading-relaxed">{email.problem}</p>
              </div>
              <div className="relative border-l-2 border-blue-200 pl-4">
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">The Solution</span>
                <p className="text-slate-800 text-sm font-medium">{email.solution}</p>
              </div>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex items-center justify-between">
               <div>
                  <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block mb-1">Call to Action</span>
                  <p className="text-blue-800 font-bold text-sm">{email.cta}</p>
               </div>
               <Target className="w-5 h-5 text-blue-300" />
            </div>
          </div>
        </div>

        {/* Improvement Ideas */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
          <div className="mb-4 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-semibold text-slate-800">Strategic Recommendations</h3>
          </div>
          <div className="space-y-3 flex-grow">
            {data.strategy.improvementIdeas.map((idea, idx) => (
              <div key={idx} className="flex gap-4 items-start p-4 hover:bg-slate-50 rounded-xl transition-all border border-transparent hover:border-slate-100 group">
                 <div className="bg-amber-50 text-amber-600 group-hover:bg-amber-100 transition-colors w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 font-bold text-xs">
                   {idx + 1}
                 </div>
                 <div>
                   <p className="text-slate-700 text-sm font-medium leading-relaxed">{idea}</p>
                 </div>
              </div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <h4 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
               <ExternalLink className="w-3 h-3 text-slate-400" />
               VERIFIED SOURCES
            </h4>
            <div className="flex flex-wrap gap-2">
               {data.sources.map((source, i) => (
                 <a 
                   key={i} 
                   href={source.uri} 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="text-[10px] text-indigo-500 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-2 py-1 rounded transition-colors truncate max-w-[150px]"
                 >
                   {source.title || new URL(source.uri).hostname}
                 </a>
               ))}
               {data.sources.length === 0 && <span className="text-xs text-slate-400">No verifiable public sources found.</span>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisDashboard;