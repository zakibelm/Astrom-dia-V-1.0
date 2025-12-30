import React from 'react';
import { ArrowUpRight, Activity, Database, Cpu } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

const stats = [
  { label: 'Active Campaigns', value: '12', change: '+2', icon: Activity, color: 'text-indigo-400' },
  { label: 'Content Generated', value: '843', change: '+12%', icon: Database, color: 'text-emerald-400' },
  { label: 'Avg ROI', value: '340%', change: '+5.4%', icon: ArrowUpRight, color: 'text-cyan-400' },
  { label: 'AI Credits', value: '45.2k', change: '-1.2k', icon: Cpu, color: 'text-amber-400' },
];

const data = [
  { name: 'Mon', usage: 4000, output: 2400 },
  { name: 'Tue', usage: 3000, output: 1398 },
  { name: 'Wed', usage: 2000, output: 9800 },
  { name: 'Thu', usage: 2780, output: 3908 },
  { name: 'Fri', usage: 1890, output: 4800 },
  { name: 'Sat', usage: 2390, output: 3800 },
  { name: 'Sun', usage: 3490, output: 4300 },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Command Center</h1>
        <p className="text-astro-500">Real-time overview of your autonomous marketing agents.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-astro-800/50 border border-astro-700 p-6 rounded-xl hover:bg-astro-800 transition-colors">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-astro-400 text-sm">{stat.label}</p>
                  <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
                </div>
                <div className={`p-2 rounded-lg bg-astro-900/50 ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className="text-emerald-400 font-medium">{stat.change}</span>
                <span className="text-astro-500 ml-2">vs last week</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Main Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-astro-800/50 border border-astro-700 p-6 rounded-xl">
          <h3 className="text-lg font-semibold text-white mb-6">Agent Activity & Output</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{fill: '#64748b'}} />
                <YAxis stroke="#64748b" tick={{fill: '#64748b'}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Bar dataKey="usage" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="output" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity / Logs */}
        <div className="bg-astro-800/50 border border-astro-700 p-6 rounded-xl">
            <h3 className="text-lg font-semibold text-white mb-4">Live Agent Logs</h3>
            <div className="space-y-4">
                {[
                    { agent: 'CopywriterAgent', action: 'Generated Blog Post', time: '2m ago', status: 'success' },
                    { agent: 'SEOAgent', action: 'Keyword Research', time: '5m ago', status: 'success' },
                    { agent: 'Validator', action: 'Brand Voice Check', time: '12m ago', status: 'warning' },
                    { agent: 'SocialAgent', action: 'LinkedIn Draft', time: '15m ago', status: 'success' },
                    { agent: 'N8N Orchestrator', action: 'Workflow Triggered', time: '22m ago', status: 'success' },
                ].map((log, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm border-b border-astro-700/50 pb-3 last:border-0 last:pb-0">
                        <div className={`w-2 h-2 rounded-full ${log.status === 'success' ? 'bg-emerald-400' : 'bg-amber-400'}`}></div>
                        <div className="flex-1">
                            <p className="text-gray-200 font-medium">{log.agent}</p>
                            <p className="text-astro-500 text-xs">{log.action}</p>
                        </div>
                        <span className="text-astro-600 text-xs">{log.time}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}