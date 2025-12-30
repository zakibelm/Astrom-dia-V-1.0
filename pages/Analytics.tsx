import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Week 1', campaigns: 4, revenue: 2400 },
  { name: 'Week 2', campaigns: 6, revenue: 3500 },
  { name: 'Week 3', campaigns: 5, revenue: 2900 },
  { name: 'Week 4', campaigns: 9, revenue: 5600 },
];

export default function Analytics() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-white">Performance Analytics</h1>
      
      <div className="bg-astro-800/50 border border-astro-700 p-6 rounded-xl">
        <h2 className="text-xl font-semibold mb-6">Revenue Impact</h2>
        <div className="h-96 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px' }}
                itemStyle={{ color: '#fff' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#818cf8" fillOpacity={1} fill="url(#colorRevenue)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}