"use client";

import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, Paperclip } from 'lucide-react';

interface ChatViewProps {
  messages: any[];
  input: string;
  setInput: (val: string) => void;
  handleSend: () => void;
  isTyping: boolean;
}

export default function ChatView({ messages, input, setInput, handleSend, isTyping }: ChatViewProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden h-full">
      {/* Message Stream */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-12 no-scrollbar pb-32">
        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={i}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-4xl mx-auto w-full space-y-2`}
            >
              <div className="flex items-center space-x-3 mb-1 px-4">
                <span className="text-[9px] text-white/30 font-bold uppercase tracking-[0.2em]">
                  {msg.role === 'user' ? 'PROFESSOR' : 'THE CURATOR'}
                </span>
                {msg.role === 'assistant' && (
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></div>
                )}
              </div>
              <div className={`rounded-3xl px-8 py-5 text-sm transition-all ${
                msg.role === 'user' 
                ? 'bg-white/5 border border-white/10 text-white/80 rounded-tr-none' 
                : 'bg-cyan-950/5 border border-cyan-400/20 text-white rounded-tl-none shadow-[0_0_40px_rgba(34,211,238,0.03)]'
              } max-w-[90%] leading-relaxed backdrop-blur-3xl`}>
                <p className="whitespace-pre-wrap">{msg.content}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={messagesEndRef} />
      </div>

      {/* High-Density Command Bar */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-4xl px-8 z-40">
        <div className="bg-[#131314]/90 backdrop-blur-3xl rounded-3xl p-3 border border-white/10 shadow-[0_30px_60px_-12px_rgba(0,0,0,0.5)] flex items-end space-x-3 focus-within:border-cyan-400/30 transition-all border-dashed">
          <div className="flex pb-2 pl-2">
            <button className="p-2.5 rounded-full text-white/20 hover:text-cyan-400 hover:bg-white/5 transition-all">
              <Paperclip size={20} />
            </button>
          </div>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSend())}
            className="flex-1 bg-transparent border-none focus:ring-0 text-white placeholder:text-white/10 py-3.5 px-2 resize-none h-14 no-scrollbar font-sans text-sm tracking-tight" 
            placeholder="Interrogate the core..."
          />
          <div className="flex pb-2 pr-2 space-x-2">
            <button className="p-2.5 rounded-full text-white/20 hover:text-rose-400 hover:bg-rose-400/5 transition-all">
              <Mic size={20} />
            </button>
            <button 
              onClick={handleSend}
              disabled={isTyping}
              className="px-6 py-2.5 rounded-2xl bg-white text-black font-bold text-sm hover:bg-cyan-400 hover:text-black transition-all active:scale-95 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              EXECUTE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
