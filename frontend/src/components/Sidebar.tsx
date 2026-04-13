"use client";

import React from 'react';
import { Brain, MessageSquare, Smartphone, Mail, MessageCircle, Globe, Database, LayoutDashboard, Settings } from 'lucide-react';

interface SidebarProps {
  view: string;
  setView: (view: string) => void;
  stats: any;
  pluginStatus: any;
}

export default function Sidebar({ view, setView, stats, pluginStatus }: SidebarProps) {
  const navItems = [
    { icon: LayoutDashboard, label: "Command Center", id: "dashboard" },
    { icon: MessageSquare, label: "Deep Chat", id: "chat" },
    { icon: Smartphone, label: "SMS Airtel", id: "sms" },
    { icon: Mail, label: "Gmail", id: "mail" },
    { icon: MessageCircle, label: "WhatsApp", id: "whatsapp" },
    { icon: Globe, label: "Browser", id: "browser" },
    { icon: Database, label: "Memory", id: "memory" },
    { icon: Settings, label: "Settings", id: "settings" },
  ];

  return (
    <aside className="hidden md:flex h-screen w-72 border-r border-white/5 bg-[#0b0b0c] flex-col p-8 space-y-10 z-40 relative">
      <div className="flex flex-col space-y-1">
        <div className="flex items-center space-x-4 mb-8">
          <div className="w-10 h-10 rounded-full border border-cyan-400/30 flex items-center justify-center p-0.5 shadow-[0_0_15px_rgba(34,211,238,0.1)]">
             <Brain className="text-cyan-400" size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tighter text-white">THE CURATOR</h1>
            <p className="text-[9px] uppercase tracking-[0.4em] text-cyan-400/60 font-mono">System Live</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
        <div className="text-[10px] uppercase tracking-[0.3em] text-white/20 px-4 mb-4 font-bold">Protocol Selection</div>
        {navItems.map((item) => (
          <button 
            key={item.id} 
            onClick={() => setView(item.id)}
            className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl transition-all duration-300 group ${
                view === item.id 
                ? 'bg-white/5 text-cyan-400 border border-white/10' 
                : 'text-white/40 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            <div className="flex items-center space-x-4">
              <item.icon size={18} className={view === item.id ? 'text-cyan-400' : 'group-hover:text-white transition-colors'} />
              <span className="text-sm font-medium tracking-tight whitespace-nowrap">{item.label}</span>
            </div>
            {/* Status Pulse */}
            {(item.id === "mail" || item.id === "whatsapp" || item.id === "sms") && (
              <div className={`w-1.5 h-1.5 rounded-full ${pluginStatus[item.id === "mail" ? "gmail" : item.id] === "active" ? 'bg-cyan-400 shadow-[0_0_8px_cyan] animate-pulse' : 'bg-white/10'}`}></div>
            )}
          </button>
        ))}
      </nav>

      <div className="pt-8 border-t border-white/5 flex flex-col space-y-6">
         <div className="space-y-4">
            <TelemetryProgress label="Neural Engine" value={stats.cpu} color="bg-cyan-400" />
            <TelemetryProgress label="Enclave RAM" value={stats.ram} color="bg-purple-400" />
         </div>
      </div>
    </aside>
  );
}

function TelemetryProgress({ label, value, color }: any) {
    return (
        <div className="space-y-2">
            <div className="flex justify-between text-[9px] uppercase tracking-[0.2em] text-white/30 font-bold">
                <span>{label}</span>
                <span>{value.toFixed(1)}%</span>
            </div>
            <div className="h-0.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full transition-all duration-1000 ease-out" style={{ width: `${value}%`, background: color.includes('bg-') ? `var(--${color.split('-')[1]}-400)` : color }}>
                     <div className={`h-full w-full ${color}`}></div>
                </div>
            </div>
        </div>
    );
}
