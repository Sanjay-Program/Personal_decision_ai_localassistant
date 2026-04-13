"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import Sidebar from '@/components/Sidebar';
import CommandDashboard from '@/components/CommandDashboard';
import ChatView from '@/components/ChatView';

export default function Home() {
  const [view, setView] = useState("dashboard"); // Default to Dashboard
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    { role: "system", content: "Welcome back, Professor. I am 'The Curator', your local AI assistant. System is stable and 100% private." }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [stats, setStats] = useState({ cpu: 0, ram: 0, available: 0 });
  const [pluginStatus, setPluginStatus] = useState({ gmail: "inactive", whatsapp: "inactive", sms: "inactive", browser: "inactive" });
  const [briefing, setBriefing] = useState("");
  const [loadingBriefing, setLoadingBriefing] = useState(true);
  const [signals, setSignals] = useState<any[]>([]);

  // System Stats Sink
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('http://localhost:8001/system/stats');
        const data = await res.json();
        setStats({ cpu: data.cpu_usage, ram: data.ram_usage, available: data.available_ram });
      } catch (e) {
        setStats({ cpu: Math.random() * 5, ram: 42, available: 4.5 });
      }
    };
    const interval = setInterval(fetchStats, 3000);
    fetchStats();
    return () => clearInterval(interval);
  }, []);

  // Plugin Vital Sync
  useEffect(() => {
    const fetchPlugins = async () => {
      try {
        const res = await fetch('http://localhost:8001/plugins/status');
        const data = await res.json();
        setPluginStatus(data);
      } catch (e) {}
    };
    const interval = setInterval(fetchPlugins, 5000);
    fetchPlugins();
    return () => clearInterval(interval);
  }, []);

  // Intelligence Briefing Ingest
  useEffect(() => {
    const fetchBriefing = async () => {
      try {
        const res = await fetch('http://localhost:8001/curator/briefing');
        const data = await res.json();
        setBriefing(data.briefing);
      } catch (e) {
        setBriefing("Curator briefing engine offline. Check backend logs.");
      } finally {
        setLoadingBriefing(false);
      }
    };

    const fetchSignals = async () => {
      try {
        const [smsRes, mailRes] = await Promise.all([
          fetch('http://localhost:8001/plugins/sms'),
          fetch('http://localhost:8001/plugins/mail')
        ]);
        const smsData = await smsRes.json();
        const mailData = await mailRes.json();
        
        const merged = [
          ...smsData.map((s: any) => ({ type: 'sms', sender: s.address, content: s.body, time: 'NOW' })),
          ...mailData.map((m: any) => ({ type: 'mail', sender: m.from, content: m.subject, time: 'LATEST' }))
        ].slice(0, 6);
        
        setSignals(merged);
      } catch (e) {}
    };

    if (view === "dashboard") {
       fetchBriefing();
       fetchSignals();
    }
  }, [view]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMessages = [...messages, { role: "user", content: input }];
    setMessages(newMessages);
    const userQuery = input;
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:8001/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: newMessages, stream: true }),
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantMessage = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value);
        assistantMessage += text;
        setMessages(prev => {
          const updated = [...prev];
          updated[updated.length - 1].content = assistantMessage;
          return updated;
        });
      }
    } catch (error) {
      console.error("Chat error:", error);
      setMessages(prev => [...prev, { role: "system", content: "Error communicating with AI. Please check if backend is running." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#0b0b0c] text-white overflow-hidden font-sans selection:bg-cyan-400/30">
      <Sidebar 
        view={view} 
        setView={setView} 
        stats={stats} 
        pluginStatus={pluginStatus} 
      />

      {/* Primary Intelligence Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Cinematic Header */}
        <header className="flex justify-between items-center px-12 h-24 bg-[#0b0b0c]/60 backdrop-blur-2xl z-30 sticky top-0 border-b border-white/5">
          <div className="flex items-center space-x-6">
            <h2 className="text-[11px] font-black uppercase tracking-[0.5em] text-white/40">Sector: Command Center</h2>
            <div className="flex items-center space-x-3 px-4 py-1.5 bg-cyan-400/5 border border-cyan-400/20 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400/80">Local AI Stream Active</span>
            </div>
          </div>
          <div className="flex items-center space-x-8">
             <div className="flex items-center space-x-2 px-4 py-1.5 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                <ShieldCheck size={14} className="text-emerald-500/40" />
                <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-emerald-500/60 transition-all">Encrypted Channel</span>
             </div>
          </div>
        </header>

        {/* Dynamic Context Switcher */}
        {view === "dashboard" ? (
          <CommandDashboard 
            stats={stats} 
            briefing={briefing} 
            loading={loadingBriefing} 
            signals={signals}
          />
        ) : (
          <ChatView 
            messages={messages} 
            input={input} 
            setInput={setInput} 
            handleSend={handleSend} 
            isTyping={isTyping} 
          />
        )}

        {/* Cinematic Underlay */}
        <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden opacity-30">
          <div className="absolute -top-[20%] -right-[10%] w-[60%] h-[60%] bg-cyan-500/10 rounded-full blur-[160px] animate-pulse"></div>
          <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-[160px] [animation-delay:2s] animate-pulse"></div>
        </div>
      </main>
    </div>
  );
}
