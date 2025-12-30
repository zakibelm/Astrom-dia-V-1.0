
import React, { useState, useEffect } from 'react';
import { User, Shield, CreditCard, Bell, Key, Radio, CheckCircle2, XCircle } from 'lucide-react';
import { INTEGRATIONS, IntegrationService } from '../services/integrationRegistry';
import { Integration } from '../types';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('integrations');
  const [integrations, setIntegrations] = useState<Integration[]>([]);

  useEffect(() => {
    IntegrationService.getAll().then(setIntegrations);
  }, []);

  const toggleIntegration = (id: string) => {
     setIntegrations(prev => prev.map(i => {
       if (i.id === id) {
         return { ...i, status: i.status === 'connected' ? 'disconnected' : 'connected' };
       }
       return i;
     }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white">Settings</h1>
        <p className="text-astro-500">Manage your profile, API keys, and autonomous agent integrations.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar Navigation */}
        <div className="w-full lg:w-64 space-y-2">
          {[
            { id: 'integrations', label: 'Integrations Hub', icon: Radio },
            { id: 'profile', label: 'Profile', icon: User },
            { id: 'billing', label: 'Billing & Usage', icon: CreditCard },
            { id: 'keys', label: 'API Keys', icon: Key },
            { id: 'notifications', label: 'Notifications', icon: Bell },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id 
                  ? 'bg-astro-800 text-white border-l-2 border-indigo-500' 
                  : 'text-astro-500 hover:bg-astro-800/50 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          
          {/* INTEGRATIONS HUB */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 p-6 rounded-xl">
                    <h2 className="text-xl font-bold text-white mb-2">⚡ Supercharge your Agents</h2>
                    <p className="text-astro-300 text-sm">
                        Connect external APIs to give your agents real-world powers. 
                        A fully integrated stack saves ~98% compared to a human agency.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {integrations.map((tool) => (
                        <div key={tool.id} className={`p-4 rounded-xl border transition-all ${tool.status === 'connected' ? 'bg-astro-800/50 border-astro-600' : 'bg-astro-900 border-astro-800 opacity-75'}`}>
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{tool.icon}</div>
                                    <div>
                                        <h3 className="font-semibold text-white">{tool.name}</h3>
                                        <span className="text-xs text-astro-500 uppercase tracking-wider">{tool.category}</span>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => toggleIntegration(tool.id)}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${tool.status === 'connected' ? 'bg-emerald-500' : 'bg-astro-700'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${tool.status === 'connected' ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>
                            <p className="text-sm text-astro-400 mb-3 min-h-[40px]">{tool.description}</p>
                            <div className="flex items-center justify-between pt-3 border-t border-astro-700/50">
                                <span className="text-xs font-mono text-astro-500">{tool.pricing}</span>
                                {tool.status === 'connected' ? (
                                    <span className="flex items-center gap-1 text-xs text-emerald-400"><CheckCircle2 size={12} /> Active</span>
                                ) : (
                                    <span className="flex items-center gap-1 text-xs text-astro-600"><XCircle size={12} /> Inactive</span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          )}

          {activeTab === 'profile' && (
             <div className="bg-astro-800/30 border border-astro-700 rounded-xl p-8 text-center text-astro-500">
                <User size={48} className="mx-auto mb-4 opacity-50" />
                <p>Profile settings placeholder</p>
             </div>
          )}
          
          {activeTab === 'keys' && (
             <div className="bg-astro-800/30 border border-astro-700 rounded-xl p-8">
                 <h3 className="text-lg font-semibold text-white mb-4">API Configuration</h3>
                 <div className="space-y-4">
                     <div>
                         <label className="block text-sm text-astro-400 mb-1">OpenAI API Key</label>
                         <input type="password" value="sk-........................" disabled className="w-full bg-astro-900 border border-astro-700 rounded px-3 py-2 text-astro-500" />
                     </div>
                     <div>
                         <label className="block text-sm text-astro-400 mb-1">Anthropic API Key</label>
                         <input type="password" value="sk-ant-........................" disabled className="w-full bg-astro-900 border border-astro-700 rounded px-3 py-2 text-astro-500" />
                     </div>
                 </div>
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
