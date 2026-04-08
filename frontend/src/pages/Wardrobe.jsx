import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, Shirt } from 'lucide-react';

export default function Wardrobe() {
  const [clothes, setClothes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', type: '', color: '', brand: '', season: 'All' });

  const token = localStorage.getItem('styleiq_token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchClothes = async () => {
    try {
      const res = await fetch('/api/clothes', { headers });
      if (res.ok) {
        const data = await res.json();
        setClothes(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchClothes();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm('Discard this item?')) return;
    try {
      await fetch(`/api/clothes/${id}`, { method: 'DELETE', headers });
      fetchClothes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const randomPic = `https://picsum.photos/400/400?random=${Math.random()}`;
    const payload = { cloth_name: formData.name, type: formData.type, color: formData.color, brand: formData.brand, season: formData.season, image_url: randomPic };
    
    try {
      const res = await fetch('/api/clothes', { method: 'POST', headers, body: JSON.stringify(payload) });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', type: '', color: '', brand: '', season: 'All' });
        fetchClothes();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex items-center justify-between mb-10 shrink-0">
        <div>
          <h1 className="text-4xl text-white font-serif tracking-tight mb-2">Wardrobe Data</h1>
          <p className="text-gray-400 text-sm">Quantify your closet. Synced securely via API.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#1A1A1A] text-white border border-[#333] px-5 py-2.5 rounded-full text-sm font-semibold hover:border-primary hover:text-primary transition-all flex items-center gap-2 shadow-sm"
        >
          <Plus size={16} /> Add Garment
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-12 no-scrollbar">
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence>
            {clothes.map((item, idx) => (
              <motion.div 
                key={item.cloth_id}
                layout
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4, delay: idx * 0.05, type: "spring", bounce: 0 }}
                className="group relative bg-[#0D0D0D] border border-[#222] rounded-2xl overflow-hidden shadow-lg hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] hover:border-[#444] transition-all duration-300"
              >
                <div className="aspect-[4/5] bg-[#111] relative overflow-hidden">
                  <motion.div 
                    className="absolute inset-0 bg-cover bg-center transition-transform duration-700 ease-out group-hover:scale-105" 
                    style={{ backgroundImage: `url(${item.image_url})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-transparent opacity-80" />
                  
                  {/* Glass Pill Tags */}
                  <div className="absolute bottom-4 left-4 flex gap-2">
                    <div className="bg-black/60 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase text-gray-300 flex items-center gap-1.5">
                      <Tag size={10} /> {item.brand || 'Unbranded'}
                    </div>
                  </div>
                </div>

                <div className="p-5 flex justify-between items-start relative z-10 bg-[#0D0D0D]">
                  <div>
                    <h4 className="font-semibold text-[15px] tracking-wide text-white mb-1 truncate max-w-[160px]">{item.cloth_name}</h4>
                    <p className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                        <Shirt size={12} className="text-primary/70" /> {item.type}
                    </p>
                  </div>
                </div>
                
                <button 
                  onClick={() => handleDelete(item.cloth_id)}
                  className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-red-500/30 text-red-400 p-2 rounded-xl opacity-0 scale-90 group-hover:opacity-100 group-hover:scale-100 transition-all hover:bg-red-500 hover:text-white"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setIsModalOpen(false)}
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative bg-[#111] border border-[#2A2A2A] p-8 rounded-3xl w-full max-w-md shadow-2xl"
            >
              <h3 className="text-2xl font-serif mb-2 text-white">Add Database Entry</h3>
              <p className="text-gray-500 text-sm mb-6">Manually catalog a new item into the StyleIQ index.</p>

              <form onSubmit={handleSubmit} className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Garment Identifier</label>
                  <input type="text" placeholder="e.g. Vintage Leather Jacket" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#1A1A1A] border border-[#333] hover:border-[#444] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder-[#444]" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Type</label>
                    <input type="text" placeholder="e.g. Outerwear" required value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full bg-[#1A1A1A] border border-[#333] hover:border-[#444] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder-[#444]" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Brand</label>
                    <input type="text" placeholder="e.g. Saint Laurent" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} className="w-full bg-[#1A1A1A] border border-[#333] hover:border-[#444] rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-primary transition-colors placeholder-[#444]" />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 bg-transparent border border-[#333] hover:bg-[#1A1A1A] text-gray-300 py-3 rounded-xl transition-colors font-semibold text-sm">Discard</button>
                  <button type="submit" className="flex-1 bg-primary border border-[#F4D03F]/50 hover:bg-[#F4D03F] text-black shadow-[0_0_15px_rgba(212,175,55,0.2)] py-3 rounded-xl transition-colors font-bold text-sm">Index Item</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
