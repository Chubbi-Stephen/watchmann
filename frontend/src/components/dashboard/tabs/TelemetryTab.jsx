import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { BarChart3, TrendingUp } from 'lucide-react';

export const TelemetryTab = memo(({ analytics }) => (
  <motion.div key="analytics" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-24">
    <header className="space-y-6">
      <h1 className="text-super-scale italic underline decoration-white/5 decoration-[12px] underline-offset-[12px]">Telemetry</h1>
      <p className="text-slate-600 font-bold uppercase tracking-[0.5em] text-sm">Signal Performance Visualisation Protocol.</p>
    </header>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      <div className="premium-card !p-12 space-y-12 shrink-0">
        <h3 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-5">
          <BarChart3 size={24} className="text-primary" aria-hidden="true" /> Sector Reach
        </h3>
        <div className="h-[400px] w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={analytics?.platformData || []}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700 }} />
              <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700 }} />
              <Tooltip cursor={{ fill: '#ffffff05' }} contentStyle={{ backgroundColor: '#080808', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '11px', color: '#fff', fontWeight: 700, textTransform: 'uppercase' }} />
              <Bar dataKey="value" fill="#bef264" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="premium-card !p-12 space-y-12 shrink-0">
        <h3 className="text-2xl font-bold text-white uppercase tracking-tight flex items-center gap-5">
          <TrendingUp size={24} className="text-primary" aria-hidden="true" /> Transmission Velocity
        </h3>
        <div className="h-[300px] md:h-[400px] w-full" aria-hidden="true">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={analytics?.activityData || []}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#bef264" stopOpacity={0.2}/>
                  <stop offset="95%" stopColor="#bef264" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
              <XAxis dataKey="name" fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700 }} />
              <YAxis fontSize={11} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontWeight: 700 }} />
              <Tooltip contentStyle={{ backgroundColor: '#080808', border: '1px solid #ffffff10', borderRadius: '16px', fontSize: '11px', color: '#fff', fontWeight: 700, textTransform: 'uppercase' }} />
              <Area type="monotone" dataKey="count" stroke="#bef264" strokeWidth={4} fillOpacity={1} fill="url(#colorCount)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  </motion.div>
));

TelemetryTab.displayName = 'TelemetryTab';
