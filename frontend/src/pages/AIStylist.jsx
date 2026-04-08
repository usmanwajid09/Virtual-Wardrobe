import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Hexagon } from 'lucide-react';
import Magnetic from '../components/Magnetic';

// Futuristic streaming text effect
const TypewriterText = ({ text }) => {
  const letters = Array.from(text);
  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({ opacity: 1, transition: { staggerChildren: 0.015, delayChildren: 0.1 * i } }),
  };
  return (
    <motion.span variants={container} initial="hidden" animate="visible" className="inline-block">
      {letters.map((char, index) => (
        <motion.span key={index} className="inline-block">
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </motion.span>
  );
};

export default function AIStylist() {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: "Hello fashion icon. What are we dressing for today?" }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const endRef = useRef(null);
  const token = localStorage.getItem('styleiq_token');

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg = { id: Date.now(), sender: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ message: userMsg.text })
      });
      const data = await res.json();
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: data.reply || "Neural inference failed." }]);
    } catch (err) {
      setMessages(prev => [...prev, { id: Date.now(), sender: 'ai', text: "Network sync error." }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-full flex flex-col max-w-5xl mx-auto relative z-10 w-full pt-4">
      {/* Cinematic Header */}
      <div className="mb-10 flex items-center justify-between">
          <div className="flex flex-col">
            <h1 className="text-5xl text-white font-serif tracking-tighter mb-1 font-light">AI <span className="italic">Stylist</span></h1>
            <p className="text-white/40 tracking-[0.2em] uppercase text-[10px] font-bold">Neural Generation Module</p>
          </div>
          <motion.div animate={{ rotate: 180 }} transition={{ duration: 10, repeat: Infinity, ease: 'linear' }} className="w-12 h-12 rounded-full border border-white/20 flex items-center justify-center">
            <Hexagon size={20} className="text-white/50" />
          </motion.div>
      </div>

      {/* Vogue Chat Interface */}
      <div className="flex-1 vogue-card flex flex-col overflow-hidden relative">
        <div className="flex-1 overflow-y-auto p-10 space-y-10 custom-scrollbar scroll-smooth">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div 
                key={msg.id}
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`flex items-end gap-4 ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 z-10 border shadow-lg ${msg.sender === 'ai' ? 'bg-white/5 border-white/10 text-white' : 'bg-white text-black border-transparent'}`}>
                  {msg.sender === 'ai' ? <Hexagon size={18} /> : <div className="font-bold text-sm">U</div>}
                </div>
                <div className={`px-6 py-4 max-w-[75%] text-sm leading-relaxed border ${msg.sender === 'user' ? 'bg-[#EBEBEB] text-[#050505] rounded-2xl rounded-br-none border-transparent' : 'bg-transparent border-white/10 text-white rounded-2xl rounded-bl-none backdrop-blur-md font-sans'}`}>
                  {msg.sender === 'ai' ? <TypewriterText text={msg.text} /> : msg.text}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-end gap-4">
               <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 text-white flex items-center justify-center shrink-0">
                 <Hexagon size={18} className="animate-spin" />
               </div>
               <div className="bg-transparent border border-white/10 px-6 py-5 rounded-2xl rounded-bl-none flex gap-2 items-center backdrop-blur-md">
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
                  <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-white/50" />
               </div>
            </motion.div>
          )}
          <div ref={endRef} className="h-4" />
        </div>

        {/* Input Dock */}
        <div className="p-6 bg-black/40 backdrop-blur-3xl border-t border-white/10 relative z-20">
          <form onSubmit={handleSubmit} className="relative flex items-center max-w-4xl mx-auto">
            <input 
              type="text" value={input} onChange={(e) => setInput(e.target.value)} disabled={isLoading} placeholder="Ask the stylist..."
              className="w-full bg-white/5 text-white border border-white/10 rounded-full pl-8 pr-16 py-4 text-sm focus:outline-none focus:border-white/30 transition-colors shadow-inner disabled:opacity-50 placeholder-white/30"
            />
            <div className="absolute right-2 top-2 bottom-2">
              <Magnetic>
                <button type="submit" disabled={isLoading || !input.trim()} className="h-full aspect-square bg-[#EBEBEB] text-black rounded-full flex items-center justify-center hover:bg-white transition-all disabled:opacity-30">
                  <Send size={16} className="-translate-x-[1px] translate-y-[1px]" />
                </button>
              </Magnetic>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
