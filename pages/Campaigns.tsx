import React, { useState, useEffect } from 'react';
import { Plus, Search, Filter, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Campaign } from '../types';
import { N8NService } from '../services/n8nService';

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await N8NService.getCampaigns();
        setCampaigns(data);
      } catch (e) {
        console.error("Failed to load campaigns", e);
        // In a real app, show a toast or error state here
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const startNewCampaign = () => {
      // Simulate creating a new ID and going to detail for setup
      const newId = `c-${Date.now()}`;
      navigate(`/campaigns/new?id=${newId}`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Campaigns</h1>
          <p className="text-astro-500">Manage your autonomous marketing workflows.</p>
        </div>
        <button 
            onClick={startNewCampaign}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors"
        >
          <Plus size={20} />
          New Campaign
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-4 bg-astro-800/30 p-4 rounded-xl border border-astro-700">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-astro-500" size={18} />
          <input 
            type="text" 
            placeholder="Search campaigns..." 
            className="w-full bg-astro-900 border border-astro-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button className="px-4 py-2 bg-astro-800 border border-astro-700 text-astro-300 rounded-lg hover:text-white flex items-center gap-2">
            <Filter size={18} /> Filter
        </button>
      </div>

      {/* List */}
      <div className="bg-astro-800/50 border border-astro-700 rounded-xl overflow-hidden">
        {loading ? (
           <div className="p-12 text-center text-astro-500">Loading DataTables...</div>
        ) : (
        <table className="w-full text-left">
          <thead className="bg-astro-800 text-astro-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="p-4 font-medium">Campaign Name</th>
              <th className="p-4 font-medium">Objective</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">ROI</th>
              <th className="p-4 font-medium">Last Updated</th>
              <th className="p-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-astro-700">
            {campaigns.map((camp) => (
              <tr key={camp.id} className="hover:bg-astro-800/80 transition-colors group">
                <td className="p-4">
                  <button 
                    onClick={() => navigate(`/campaigns/${camp.id}`)}
                    className="font-semibold text-white hover:text-indigo-400 text-left bg-transparent border-0 p-0"
                  >
                    {camp.name}
                  </button>
                  <div className="text-xs text-astro-500 mt-1">{camp.client_id}</div>
                </td>
                <td className="p-4 text-astro-300">{camp.brief.objective}</td>
                <td className="p-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${camp.status === 'published' ? 'bg-emerald-500/20 text-emerald-400' : 
                      camp.status === 'verify' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-indigo-500/20 text-indigo-400'}`}>
                    {camp.status}
                  </span>
                </td>
                <td className="p-4 text-white font-mono">
                    {camp.metrics ? `${camp.metrics.roi}x` : '-'}
                </td>
                <td className="p-4 text-astro-500 text-sm">
                    {new Date(camp.created_at).toLocaleDateString()}
                </td>
                <td className="p-4 text-right">
                    <button className="text-astro-500 hover:text-white">
                        <MoreHorizontal size={20} />
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </div>
  );
}