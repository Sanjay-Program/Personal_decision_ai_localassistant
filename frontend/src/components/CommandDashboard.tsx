"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { Brain, ShieldCheck, Cpu, Database, Activity, Landmark, HeartPulse, MessageSquare, Mail } from 'lucide-react';

interface DashboardProps {
  stats: any;
  briefing: string;
  loading: boolean;
  signals: any[];
}

export default function CommandDashboard({ stats, briefing, loading, signals }: DashboardProps) {
  return (
    <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 no-scrollbar pb-32 dot-matrix">
      {/* Intelligence Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        <div className="glass-card rounded-3xl p-10 border-cyan-400/20 shadow-[0_0_50px_rgba(34,211,238,0.05)] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-400/5 blur-[100px] rounded-full -mr-20 -mt-20"></div>
          
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center">
              <Brain className="text-cyan-400" size={28} />
            </div>
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white uppercase italic">Command Center Briefing</h2>
              <p className="text-[9px] uppercase tracking-[0.4em] text-cyan-400/60 font-mono">Curator Reasoning Engine active</p>
            </div>
          </div>

          <div className="min-h-[150px] relative">
            {loading ? (
              <div className="flex items-center justify-center h-full space-x-3">
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.2s]"></div>
                <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse [animation-delay:0.4s]"></div>
              </div>
            ) : (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-lg leading-relaxed text-white/80 font-serif italic"
              >
                {briefing || "Waiting for signal cross-correlation..."}
              </motion.p>
            )}
          </div>
        </div>
      </motion.div>

      {/* Resource & Vital Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
        <StatCard 
          icon={Cpu} 
          label="Neural Load" 
          value={`${stats.cpu.toFixed(1)}%`} 
          color="text-cyan-400" 
          progress={stats.cpu}
        />
        <StatCard 
          icon={Database} 
          label="Enclave RAM" 
          value={`${stats.ram.toFixed(1)}%`} 
          color="text-purple-400" 
          progress={stats.ram}
        />
        <StatCard 
          icon={Landmark} 
          label="Capital Flow" 
          value="Optimal" 
          color="text-emerald-400" 
          progress={85}
        />
        <StatCard 
          icon={HeartPulse} 
          label="Bio Rhythm" 
          value="Syncing" 
          color="text-rose-400" 
          progress={72}
        />
      </div>

      {/* Signal Stream */}
      <div className="max-w-6xl mx-auto">
         <div className="flex items-center justify-between mb-8">
            <h3 className="text-[10px] uppercase tracking-[0.4em] text-white/30 font-black">Inbound Signal Stream</h3>
            <div className="h-px flex-1 bg-white/5 mx-6"></div>
            <Activity className="text-cyan-400/20" size={14} />
         </div>
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {signals.length > 0 ? signals.map((sig, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="glass-card rounded-2xl p-6 border-white/5 hover:border-white/10 transition-all cursor-pointer group"
              >
                  <div className="flex justify-between items-start mb-4">
                     <div className={`p-2 rounded-lg bg-white/5 border border-white/10 group-hover:border-${sig.type === 'sms' ? 'cyan' : 'purple'}-400/30 transition-all`}>
                        {sig.type === 'sms' ? (
                            <MessageSquare size={16} className="text-white/40 group-hover:text-cyan-400" />
                        ) : (
                            <Mail size={16} className="text-white/40 group-hover:text-purple-400" />
                        )}
                     </div>
                     <span className="text-[9px] uppercase font-mono text-white/20 tracking-widest">{sig.time}</span>
                  </div>
                  <h4 className="text-white/30 text-[9px] mb-1 uppercase tracking-[0.2em] font-bold">Signal from: {sig.sender}</h4>
                  <p className="text-sm text-white/70 line-clamp-2 leading-relaxed">{sig.content}</p>
              </motion.div>
            )) : (
              [1, 2, 3].map(i => (
                <div key={i} className="glass-card rounded-2xl p-6 border-white/5 opacity-50 animate-pulse h-32"></div>
              ))
            )}
         </div>
      </div>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, progress }: any) {
  return (
    <div className="glass-card rounded-2xl p-6 border-white/5 relative overflow-hidden group hover:border-white/15 transition-all">
      <div className="flex justify-between items-start mb-4">
        <Icon className={`${color} opacity-40 group-hover:opacity-100 transition-all`} size={24} />
        <span className={`text-xl font-bold font-mono ${color}`}>{value}</span>
      </div>
      <p className="text-[10px] uppercase tracking-[0.2em] text-white/30 font-bold">{label}</p>
      
      <div className="mt-4 h-1 w-full bg-white/5 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          className={`h-full ${color.replace('text-', 'bg-')}`}
        ></motion.div>
      </div>
    </div>
  );
}
