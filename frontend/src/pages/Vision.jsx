import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, ScanLine } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Vision() {
  const navigate = useNavigate();
  const [consoleLog, setConsoleLog] = useState([]);
  
  const scanSequence = [
    { text: "INIT: Vision Model v4 Active", delay: 500 },
    { text: "[Color Space: #050505 (Obsidian)] detected", delay: 2000 },
    { text: "Surface mapping... 98.4% Lambskin Leather", delay: 3500 },
    { text: "Topographic markers: Heavy zipper hardware", delay: 4800 },
    { text: "CLASSIFICATION: Moto Jacket [Outerwear]", delay: 6000 },
    { text: "Indexing to digital twin system...", delay: 7500 },
    { text: "SUCCESS: Garment cataloged in 2.1s", delay: 8500 },
  ];

  useEffect(() => {
    let timeouts = [];
    scanSequence.forEach(({ text, delay }) => {
      const id = setTimeout(() => {
        setConsoleLog(prev => [...prev, text]);
      }, delay);
      timeouts.push(id);
    });
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden text-[#EBEBEB] font-sans relative">
      
      {/* Navigation */}
      <nav className="fixed w-full flex items-center justify-between px-12 py-8 z-50">
          <button onClick={() => navigate('/')} className="group flex items-center gap-4 text-xs tracking-[0.2em] uppercase font-bold hover:opacity-50 transition-opacity">
              <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Architecture Return
          </button>
      </nav>

      {/* Ambient Lighting */}
      <div className="absolute top-[10%] left-[30%] w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <main className="relative z-10 min-h-screen pt-32 px-12 flex flex-col xl:flex-row items-center justify-center gap-16">
         
         <div className="text-left w-full xl:w-1/3 flex flex-col justify-center">
            <h1 className="text-[10vw] xl:text-[8vw] font-serif font-black tracking-tighter leading-[0.8] mb-8">
               Pure <br/><span className="text-white/30 italic font-light">Vision.</span>
            </h1>
            <p className="text-sm text-white/50 tracking-wide font-light border-l border-white/20 pl-6 leading-loose">
               The digital twin processor bypasses manual entry entirely. It captures structural warmth, material signatures, and silhouette data automatically.
            </p>
         </div>

         <div className="w-full xl:w-2/3 h-[70vh] min-h-[500px] flex gap-4 max-w-5xl">
             
             {/* The Scanner Node */}
             <div className="vogue-card flex-1 relative overflow-hidden flex flex-col">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale"></div>
                 <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

                 <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 2.5, duration: 1 }} className="absolute top-1/4 left-1/4 w-1/2 h-1/2 border border-white/30 bg-white/5 rounded-xl backdrop-blur-sm">
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] uppercase tracking-[0.2em] font-bold px-4 py-1 rounded-full whitespace-nowrap shadow-2xl">Leather Jacket Detected</div>
                 </motion.div>

                 <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, ease: "linear", repeat: Infinity }} className="absolute left-0 right-0 h-[1px] bg-red-500/50 shadow-[0_0_20px_rgba(229,57,53,0.8)] z-20"></motion.div>
             </div>

             {/* The Terminal Node */}
             <div className="vogue-card w-[350px] p-8 flex flex-col">
                 <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/30 border-b border-white/10 pb-4 mb-6">Compute Subsystem</div>
                 <div className="flex-1 font-mono text-[11px] text-white/80 leading-loose overflow-y-auto no-scrollbar">
                     {consoleLog.map((log, idx) => (
                         <motion.div key={idx} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} className="mb-4">
                            <span className="text-white/30 mr-3">[{idx * 21}ms]</span>{log}
                         </motion.div>
                     ))}
                     <motion.div animate={{ opacity: [1, 0, 1] }} transition={{ repeat: Infinity, duration: 0.8 }} className="w-2 h-3 bg-white/50 mt-2 inline-block"></motion.div>
                 </div>
             </div>

         </div>
      </main>
    </div>
  );
}
