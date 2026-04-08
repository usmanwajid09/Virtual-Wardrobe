import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

export default function Events() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem('styleiq_token');
  const headers = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

  const fetchEvents = async () => {
    try {
      const res = await fetch('/api/events', { headers });
      if (res.ok) setEvents(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl text-white mb-2">Events Calendar</h1>
          <p className="text-gray-400">Tell the AI your plans so it can style you appropriately.</p>
        </div>
        <button className="bg-primary text-black px-6 py-3 rounded-full font-bold hover:bg-white transition-colors">
          + Add Event
        </button>
      </div>

      <div className="space-y-4">
        {events.map((ev, idx) => {
          const dateObj = new Date(ev.event_date);
          const day = dateObj.getDate() || '15';
          const month = dateObj.toLocaleString('default', { month: 'short' }) || 'Nov';

          return (
            <motion.div 
              key={ev.event_id || idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="glass-card p-6 flex items-center justify-between"
            >
              <div className="flex items-center gap-6">
                <div className="flex flex-col items-center justify-center w-16 h-16 bg-primary/10 rounded-xl text-primary border border-primary/20">
                  <strong className="text-2xl font-serif leading-none">{day}</strong>
                  <span className="text-xs uppercase font-bold tracking-wider">{month}</span>
                </div>
                <div>
                  <h4 className="text-xl font-serif text-white">{ev.event_name}</h4>
                  <p className="text-gray-400 font-sans text-sm mt-1">Location: {ev.location} • Type: {ev.type}</p>
                </div>
              </div>
              <button 
                onClick={() => alert(`Context sent to AI for ${ev.event_name}!`)}
                className="border border-white/20 text-white px-6 py-3 rounded-full hover:bg-white hover:text-black transition-colors font-bold text-sm"
              >
                Generate Look
              </button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
