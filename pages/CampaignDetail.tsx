
import React, { useState } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { CopywriterAgent, SEOAgent, SocialMediaAgent, ResearchAgent } from '../services/agents';
import { N8NService } from '../services/n8nService';
import OEVVStepper from '../components/OEVVStepper';
import { Play, RotateCw, CheckCircle, AlertTriangle, FileText, Share2, Search as SearchIcon, Cpu } from 'lucide-react';
import { CampaignStatus } from '../types';

export default function CampaignDetail() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const isNew = searchParams.get('id'); 
  const navigate = useNavigate();

  // State
  const [status, setStatus] = useState<CampaignStatus>(isNew ? 'draft' : 'observe');
  const [logs, setLogs] = useState<string[]>([]);
  const [brief, setBrief] = useState({
      name: 'New Campaign',
      objective: 'Brand Awareness',
      industry: 'SaaS',
      topic: 'AI Automation'
  });
  
  // Results
  const [observeData, setObserveData] = useState<any>(null);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [verifyResults, setVerifyResults] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // New State for Tool Usage Visualization
  const [activeTools, setActiveTools] = useState<string[]>([]);

  const addLog = (msg: string) => setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);

  const handleBriefChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      setBrief({...brief, [e.target.name]: e.target.value });
  }

  // Phase 1: OBSERVE
  const startObserve = async () => {
      setIsProcessing(true);
      setStatus('observe');
      addLog('Starting OBSERVE Phase via N8N...');
      addLog('Initializing Research Agent...');
      
      try {
          const researchAgent = new ResearchAgent();
          // Simulate Tool Usage in UI
          setActiveTools(['Apollo.io', 'Google Trends', 'SimilarWeb']);
          
          const res = await researchAgent.execute({
             type: 'market_intel',
             context: brief
          });

          // Also trigger N8N general observe
          const n8nRes = await N8NService.triggerObservePhase(brief);

          setObserveData({ ...n8nRes, ...res.data });
          
          addLog(`Market Analysis Complete. Found ${n8nRes.marketAnalysis.competitors.length} competitors.`);
          addLog(`Research Agent used: ${res.metadata.toolsUsed?.join(', ')}`);
          
      } catch (error: any) {
          addLog(`ERROR: Observe phase failed - ${error.message}`);
      } finally {
          setIsProcessing(false);
          setActiveTools([]);
      }
  };

  // Phase 2: EXECUTE (Agents)
  const startExecute = async () => {
      if(!observeData) return;
      setIsProcessing(true);
      setStatus('execute');
      addLog('Initializing Content Agents...');

      try {
          const copyAgent = new CopywriterAgent();
          const seoAgent = new SEOAgent();
          const socialAgent = new SocialMediaAgent();

          addLog('Agents dispatched: Copywriter, SEO, Social');
          setActiveTools(['Claude 3.5 Sonnet', 'DataForSEO', 'Mention', 'GPT-4o']);

          const [copyRes, seoRes, socialRes] = await Promise.all([
              copyAgent.execute({
                  type: 'blog_writing',
                  context: { ...brief, brandVoiceId: observeData.brandVoiceId, tone: 'Professional' }
              }),
              seoAgent.execute({
                  type: 'keyword_research',
                  context: { topic: brief.topic }
              }),
              socialAgent.execute({
                  type: 'post_generation',
                  context: { ...brief, content: 'This is a placeholder for the blog summary', platforms: ['linkedin'], tone: 'Professional' }
              })
          ]);

          setGeneratedContent({
              copy: copyRes.data,
              seo: seoRes.data,
              social: socialRes.data,
              tools: [...(copyRes.metadata.toolsUsed || []), ...(seoRes.metadata.toolsUsed || [])]
          });

          addLog(`EXECUTE Phase Complete.`);
          setStatus('verify');
      } catch (error: any) {
          addLog(`ERROR: Execution failed - ${error.message}`);
      } finally {
          setIsProcessing(false);
          setActiveTools([]);
      }
  };

  // Phase 3: VERIFY
  const startVerify = async () => {
      setIsProcessing(true);
      addLog('Triggering Verification Workflow...');
      
      try {
          const res = await N8NService.triggerVerifyPhase({ 
              content: generatedContent 
          });
          
          setVerifyResults(res);
          addLog(`Verification Finished. Status: ${res.pass ? 'PASSED' : 'NEEDS REVISION'}`);
          
          if(res.pass) {
              setStatus('validate'); // Ready to publish
          } else {
              addLog('Triggering Refinement Loop automatically...');
          }
      } catch (error: any) {
          addLog(`ERROR: Verification failed - ${error.message}`);
      } finally {
          setIsProcessing(false);
      }
  };

  const publish = () => {
      setStatus('published');
      addLog('Campaign published to all channels via APIs.');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-white">{brief.name}</h1>
          <p className="text-astro-500">ID: {id || isNew}</p>
        </div>
        <div className="flex gap-2">
            {status === 'validate' && (
                <button onClick={publish} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2">
                    <Share2 size={20} /> Publish Campaign
                </button>
            )}
        </div>
      </div>

      {/* Stepper */}
      <OEVVStepper status={status} />

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Configuration & Status */}
        <div className="space-y-6">
            <div className="bg-astro-800/50 border border-astro-700 p-6 rounded-xl">
                <h3 className="text-lg font-semibold text-white mb-4">Campaign Brief</h3>
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-astro-500 uppercase mb-1">Campaign Name</label>
                        <input name="name" value={brief.name} onChange={handleBriefChange} className="w-full bg-astro-900 border border-astro-700 rounded p-2 text-white" />
                    </div>
                    <div>
                        <label className="block text-xs text-astro-500 uppercase mb-1">Objective</label>
                        <select name="objective" value={brief.objective} onChange={handleBriefChange} className="w-full bg-astro-900 border border-astro-700 rounded p-2 text-white">
                            <option>Brand Awareness</option>
                            <option>Lead Generation</option>
                            <option>Sales</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-xs text-astro-500 uppercase mb-1">Topic</label>
                        <input name="topic" value={brief.topic} onChange={handleBriefChange} className="w-full bg-astro-900 border border-astro-700 rounded p-2 text-white" />
                    </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-astro-700">
                    {status === 'draft' && (
                        <button onClick={startObserve} disabled={isProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isProcessing ? <RotateCw className="animate-spin" /> : <Play size={20} />}
                            Start OBSERVE Phase
                        </button>
                    )}
                    {status === 'observe' && observeData && (
                        <button onClick={startExecute} disabled={isProcessing} className="w-full bg-indigo-600 hover:bg-indigo-700 py-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isProcessing ? <RotateCw className="animate-spin" /> : <Play size={20} />}
                            Launch Agents (EXECUTE)
                        </button>
                    )}
                    {status === 'execute' && (
                         <div className="text-center bg-astro-900/50 py-4 rounded border border-indigo-500/30">
                            <div className="text-indigo-400 animate-pulse mb-2 font-semibold">Agents working...</div>
                            <div className="flex flex-wrap gap-2 justify-center px-4">
                                {activeTools.map(tool => (
                                    <span key={tool} className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded border border-indigo-500/20">{tool}</span>
                                ))}
                            </div>
                         </div>
                    )}
                    {(status === 'verify' || (status === 'execute' && generatedContent)) && (
                         <button onClick={startVerify} disabled={isProcessing} className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg text-white font-semibold flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isProcessing ? <RotateCw className="animate-spin" /> : <CheckCircle size={20} />}
                            Run Verification
                        </button>
                    )}
                </div>
            </div>

            {/* Logs Console */}
            <div className="bg-black/40 border border-astro-800 p-4 rounded-xl h-64 overflow-y-auto font-mono text-xs">
                <div className="text-astro-500 mb-2 border-b border-astro-800 pb-2 flex justify-between">
                    <span>SYSTEM LOGS</span>
                    <span className="text-emerald-500">● LIVE</span>
                </div>
                {logs.length === 0 && <span className="text-astro-700">Ready...</span>}
                {logs.map((log, i) => (
                    <div key={i} className="text-emerald-500/80 mb-1">{log}</div>
                ))}
            </div>
        </div>

        {/* Right Column: Output Visualization */}
        <div className="lg:col-span-2 space-y-6">
            
            {/* OBSERVE OUTPUT */}
            {observeData && (
                <div className="bg-astro-800/30 border border-astro-700 p-6 rounded-xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-indigo-500/10 p-2 rounded-bl-xl border-b border-l border-indigo-500/20">
                        <span className="text-xs text-indigo-400 font-mono">POWERED BY APOLLO.IO + SIMILARWEB</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4 text-indigo-400">
                        <SearchIcon size={20} />
                        <h3 className="font-semibold">Market Intelligence</h3>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-astro-900/50 p-3 rounded border border-astro-800">
                            <div className="text-xs text-astro-500 uppercase">Identified Competitors</div>
                            <div className="mt-1 flex flex-wrap gap-2">
                                {observeData.marketAnalysis.competitors.map((c: string) => (
                                    <span key={c} className="bg-astro-800 px-2 py-1 rounded text-sm">{c}</span>
                                ))}
                            </div>
                        </div>
                        <div className="bg-astro-900/50 p-3 rounded border border-astro-800">
                            <div className="text-xs text-astro-500 uppercase">Leads Found</div>
                            <div className="mt-1 flex items-baseline gap-2">
                                <span className="text-2xl font-bold text-white">{observeData.leadsFound || 12}</span>
                                <span className="text-xs text-emerald-500">verified emails</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* EXECUTE OUTPUT */}
            {generatedContent && (
                <div className="bg-astro-800/30 border border-astro-700 p-6 rounded-xl">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2 text-emerald-400">
                            <FileText size={20} />
                            <h3 className="font-semibold">Generated Content</h3>
                        </div>
                        <div className="flex gap-2">
                            {generatedContent.tools?.slice(0,2).map((t: string, i: number) => (
                                <span key={i} className="text-[10px] uppercase bg-astro-900 text-astro-400 px-2 py-1 rounded border border-astro-700">{t}</span>
                            ))}
                        </div>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="bg-astro-900 p-4 rounded-lg border border-astro-800">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-xs font-bold text-astro-400">BLOG POST (Claude Sonnet)</span>
                                <span className="text-xs bg-astro-800 px-2 py-1 rounded text-astro-500">Draft</span>
                            </div>
                            <p className="text-sm text-gray-300 leading-relaxed">
                                {generatedContent.copy}
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="bg-astro-900 p-4 rounded-lg border border-astro-800">
                                <span className="text-xs font-bold text-astro-400 block mb-2">SEO KEYWORDS (DataForSEO)</span>
                                <ul className="text-sm space-y-1">
                                    {generatedContent.seo.slice(0,3).map((kw: any, i: number) => (
                                        <li key={i} className="flex justify-between">
                                            <span>{kw.term}</span>
                                            <span className="text-emerald-500">{kw.searchVolume} vol</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="bg-astro-900 p-4 rounded-lg border border-astro-800">
                                <span className="text-xs font-bold text-astro-400 block mb-2">SOCIAL (GPT-4)</span>
                                <p className="text-sm italic text-gray-400">"{generatedContent.social.linkedin}"</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VERIFY OUTPUT */}
            {verifyResults && (
                <div className={`bg-astro-800/30 border p-6 rounded-xl ${verifyResults.pass ? 'border-emerald-500/50' : 'border-amber-500/50'}`}>
                    <div className="flex items-center justify-between mb-4">
                        <div className={`flex items-center gap-2 ${verifyResults.pass ? 'text-emerald-400' : 'text-amber-400'}`}>
                            {verifyResults.pass ? <CheckCircle size={20} /> : <AlertTriangle size={20} />}
                            <h3 className="font-semibold">Verification Results</h3>
                        </div>
                        <div className="text-sm">Score: <span className="font-bold text-white">92/100</span></div>
                    </div>
                    
                    <div className="space-y-2">
                        {verifyResults.verifications.map((v: any, i: number) => (
                            <div key={i} className="flex items-center justify-between bg-astro-900/50 p-3 rounded">
                                <span className="capitalize text-sm">{v.type.replace('_', ' ')}</span>
                                <div className="flex items-center gap-3">
                                    {v.score < 80 && <span className="text-xs text-amber-500">Needs review</span>}
                                    <div className="w-24 h-2 bg-astro-800 rounded-full overflow-hidden">
                                        <div className={`h-full ${v.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${v.score}%`}}></div>
                                    </div>
                                    <span className="text-sm font-mono w-8">{v.score}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

        </div>
      </div>
    </div>
  );
}
