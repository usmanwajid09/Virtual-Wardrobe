import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Outfits() {
  const [outfits, setOutfits] = useState([]);
  const token = localStorage.getItem('styleiq_token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  useEffect(() => {
    const fetchOutfits = async () => {
      try {
        const res = await fetch('/api/outfits', { headers });
        if (res.ok) setOutfits(await res.json());
      } catch (err) {
        console.error(err);
      }
    };
    fetchOutfits();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-4xl text-white mb-2">Generated Outfits</h1>
        <p className="text-gray-400">AI suggestions based on your wardrobe.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outfits.map((item, idx) => {
          const isPremium = item.style_category === 'Formal';
          
          return (
            <motion.div 
              key={item.outfit_id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ y: -8 }}
              className={`glass-card p-6 border-t-4 ${isPremium ? 'border-primary' : 'border-white/10'}`}
            >
              <div className="inline-block bg-white/10 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-4 text-gray-300">
                {item.season} - {item.style_category}
              </div>
              <h3 className="text-2xl font-serif text-white mb-2">{item.outfit_name}</h3>
              <p className="text-gray-400 font-sans text-sm mb-8">AI generated composition perfectly matched to your wardrobe.</p>
              <button 
                onClick={() => alert(`Saved outfit ${item.outfit_name}!`)}
                className="w-full bg-white/5 hover:bg-white text-white hover:text-black transition-colors font-bold px-4 py-3 rounded-xl border border-white/10"
              >
                Save Style
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
