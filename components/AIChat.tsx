
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Sparkles, Loader2, Command, Terminal } from 'lucide-react';
import { generateAIResponse } from '../services/geminiService';
import { ChatMessage } from '../types';

export const AIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'model', text: "Systems online. I'm Sumit's AI liaison. How can I assist with your inquiry today?", timestamp: new Date() }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { role: 'user', text: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateAIResponse(input);
      setMessages(prev => [...prev, { role: 'model', text: responseText, timestamp: new Date() }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Connection error. Protocol failed.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-6 w-[90vw] md:w-[400px] glass-panel rounded-[2rem] shadow-2xl flex flex-col overflow-hidden border border-white/10 animate-in slide-in-from-bottom-8 fade-in duration-500">
          {/* Header */}
          <div className="p-6 flex justify-between items-center border-b border-white/5 bg-white/[0.02]">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                <Sparkles size={16} className="text-indigo-400" />
              </div>
              <div>
                <span className="block font-display font-bold text-sm text-white">Project Liaison</span>
                <span className="flex items-center gap-1.5 text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Active Node
                </span>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)} 
              className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-full transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="h-[400px] overflow-y-auto p-6 space-y-6 scrollbar-hide bg-[#050505]/30">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm leading-relaxed ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-br-none shadow-lg shadow-indigo-600/10' 
                    : 'bg-white/5 text-gray-300 rounded-bl-none border border-white/5'
                }`}>
                  {msg.text}
                  <div className={`mt-2 text-[9px] font-mono uppercase tracking-tighter opacity-40 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white/5 p-4 rounded-2xl rounded-bl-none flex items-center gap-3 border border-white/5">
                  <Loader2 size={14} className="animate-spin text-indigo-400" />
                  <span className="text-[10px] font-mono text-gray-500 uppercase tracking-widest">Synthesizing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-white/5 bg-white/[0.01]">
            <div className="relative flex items-center gap-2 bg-white/[0.03] border border-white/10 rounded-full px-4 py-1.5 focus-within:border-indigo-500/50 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask about my philosophy..."
                className="flex-1 bg-transparent py-2 text-sm text-white focus:outline-none placeholder:text-gray-600"
              />
              <button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="bg-white text-black hover:bg-indigo-400 hover:text-white disabled:opacity-20 disabled:hover:bg-white disabled:hover:text-black p-2 rounded-full transition-all flex items-center justify-center"
              >
                <Send size={16} />
              </button>
            </div>
            <div className="mt-3 flex items-center justify-center gap-2">
              <Command size={10} className="text-gray-700" />
              <span className="text-[9px] font-mono text-gray-700 uppercase tracking-[0.2em]">End-to-End Encryption Active</span>
            </div>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative flex items-center justify-center w-16 h-16 rounded-full shadow-2xl transition-all duration-500 ease-premium ${
          isOpen ? 'bg-white text-black rotate-90 scale-90' : 'bg-indigo-600 text-white hover:scale-110'
        }`}
      >
        <div className="absolute inset-0 rounded-full bg-indigo-600 animate-pulse-slow opacity-20 -z-10 group-hover:scale-150 transition-transform"></div>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} className="group-hover:rotate-12 transition-transform" />}
        
        {!isOpen && (
           <span className="absolute -top-1 -right-1 flex h-4 w-4">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
             <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 border-2 border-background"></span>
           </span>
        )}
      </button>
    </div>
  );
};
