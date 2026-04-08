import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, ScanLine } from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  
  // Impossibly precise cinematic parallax calculations
  const yHeroText = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const opacityHeroParams = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const yImageLeft = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const yImageRight = useTransform(scrollYProgress, [0, 1], [0, 200]);

  return (
    <div className="bg-[#050505] min-h-screen text-[#EBEBEB] font-sans selection:bg-[#EBEBEB] selection:text-[#050505]">
      
      {/* Hyper-minimalist Global Navigation */}
      <nav className="fixed w-full flex items-center justify-between px-12 py-8 z-50 mix-blend-difference">
          <div className="font-serif text-2xl font-black italic tracking-tighter">StyleIQ<span className="text-red-500">.</span></div>
          <div className="hidden md:flex gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-white/50">
            <a href="#vision" className="hover:text-white transition-colors duration-500">Vision Architecture</a>
            <a href="#pricing" className="hover:text-white transition-colors duration-500">Subscription</a>
          </div>
          <button 
             onClick={() => navigate('/login')}
             className="text-[10px] font-bold tracking-[0.2em] uppercase border border-white/20 px-6 py-3 rounded-full hover:bg-white hover:text-black transition-all duration-500"
          >
             Access Interface
          </button>
      </nav>

      {/* Cinematic Hero Parallax */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
          {/* Absolute Center Typography */}
          <motion.div 
            style={{ y: yHeroText, opacity: opacityHeroParams }}
            className="text-center z-20 flex flex-col items-center pointer-events-none w-full px-4"
          >
              <h1 className="text-[14vw] leading-[0.8] font-black tracking-tighter font-serif clip-text">
                 VIRTUAL
              </h1>
              <h1 className="text-[14vw] leading-[0.8] font-black tracking-tighter font-serif clip-text ml-[10vw]">
                 <span className="italic font-light">ELEGANCE</span>
              </h1>
              <p className="mt-12 text-sm max-w-md font-light text-white/40 tracking-wide uppercase leading-loose text-center">
                 The definitive digital twin for your wardrobe. Powered by autonomous machine vision and algorithmic styling logic.
              </p>
          </motion.div>

          {/* Ethereal Floating Assets */}
          <motion.div style={{ y: yImageLeft }} className="absolute left-[5%] top-[20%] z-30 pointer-events-none hidden lg:block">
             <div className="w-[30vw] h-[45vw] max-w-[400px] vignette-img overflow-hidden rounded-[2rem] rogue-shadow">
                <img src="https://images.unsplash.com/photo-1550639524-a6f58345a278?q=80&w=800" className="w-full h-full object-cover scale-110 opacity-70 mix-blend-luminosity" alt="Fashion" />
             </div>
          </motion.div>

          <motion.div style={{ y: yImageRight }} className="absolute right-[5%] bottom-[5%] z-10 pointer-events-none hidden lg:block">
             <div className="w-[20vw] h-[30vw] max-w-[300px] vignette-img overflow-hidden rounded-[2rem] rogue-shadow">
                <img src="https://images.unsplash.com/photo-1434389678369-182cb123e4db?q=80&w=800" className="w-full h-full object-cover scale-110 opacity-50 mix-blend-luminosity" alt="Fashion" />
             </div>
          </motion.div>

          {/* Ambient Lighting */}
          <div className="absolute top-[30%] left-[50%] -translate-x-1/2 w-[80vw] h-[80vw] rounded-full bg-white/5 blur-[150px] pointer-events-none z-0"></div>
      </section>

      {/* Restored Vision API Section */}
      <section id="vision" className="min-h-screen py-40 px-10 flex flex-col items-center justify-center relative">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none"></div>
          
          <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div>
                 <span className="text-[10px] text-white/50 tracking-[0.3em] uppercase mb-4 block"><Sparkles size={12} className="inline mr-2" /> Neural Engine</span>
                 <h2 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none mb-8">
                    See <br/><span className="italic text-white/30">Everything.</span>
                 </h2>
                 <p className="text-lg text-white/60 font-light leading-relaxed max-w-md">
                    Our proprietary Vision Architecture maps your clothing into structured data. Color, material signatures, and structural intent—extracted flawlessly in milliseconds.
                 </p>
                 <button onClick={() => navigate('/vision')} className="mt-12 flex items-center gap-4 text-xs font-bold uppercase tracking-[0.2em] hover:opacity-50 transition-opacity">
                    Explore Architecture <ArrowRight size={14} />
                 </button>
              </div>

              <div className="vogue-card h-[600px] w-full relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800')] bg-cover bg-center opacity-40 mix-blend-luminosity grayscale"></div>
                  <ScanLine size={100} strokeWidth={0.5} className="text-white/20 z-10" />
                  <motion.div animate={{ top: ['0%', '100%', '0%'] }} transition={{ duration: 4, ease: "linear", repeat: Infinity }} className="absolute left-0 right-0 h-[1px] bg-red-500/50 shadow-[0_0_20px_rgba(229,57,53,0.8)] z-20"></motion.div>
              </div>
          </div>
      </section>

      {/* Restored Pricing Options */}
      <section id="pricing" className="py-40 px-6 flex flex-col items-center bg-[#030303] relative border-t border-white/5">
          <h2 className="text-4xl font-serif tracking-tighter mb-20 text-center">Select your <span className="italic text-white/40">Tier.</span></h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl w-full">
              {/* Hobbyist */}
              <div className="border border-white/5 p-12 rounded-[2rem] bg-transparent hover:bg-white/5 transition-colors group">
                  <h3 className="text-xl font-serif tracking-tight mb-2">Hobbyist</h3>
                  <div className="mb-10"><span className="text-5xl font-light">$0</span></div>
                  <ul className="space-y-4 text-sm text-white/40 font-light list-disc pl-4">
                      <li>Up to 50 garments</li>
                      <li>Standard suggestions</li>
                      <li>Basic weather sync</li>
                  </ul>
              </div>

              {/* Professional */}
              <div className="vogue-card p-12 rounded-[2rem] border border-white/20 bg-white/5 text-white relative scale-105 z-10 flex flex-col">
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold uppercase tracking-[0.2em] px-4 py-2 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)]">Most Popular</div>
                  <h3 className="text-xl font-serif tracking-tight mb-2">Professional</h3>
                  <div className="mb-10"><span className="text-5xl font-light">$29</span></div>
                  <ul className="space-y-4 text-sm text-white/80 font-light list-disc pl-4 flex-1">
                      <li>Infinite algorithmic space</li>
                      <li>GPT-4V Auto-indexing</li>
                      <li>A.I. Predictive Analytics</li>
                  </ul>
                  <button className="w-full bg-white text-black py-4 rounded-full text-xs font-bold uppercase tracking-[0.2em] mt-8 hover:scale-105 transition-transform">Deploy</button>
              </div>

              {/* Stylist */}
              <div className="border border-white/5 p-12 rounded-[2rem] bg-transparent hover:bg-white/5 transition-colors group">
                  <h3 className="text-xl font-serif tracking-tight mb-2">Stylist Firm</h3>
                  <div className="mb-10"><span className="text-5xl font-light">$99</span></div>
                  <ul className="space-y-4 text-sm text-white/40 font-light list-disc pl-4">
                      <li>Client portfolio management</li>
                      <li>White-label exports</li>
                      <li>Dedicated NLP Training</li>
                  </ul>
              </div>
          </div>
      </section>

    </div>
  );
}
