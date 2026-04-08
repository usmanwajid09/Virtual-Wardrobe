import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('styleiq_token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Login failed.');
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden text-[#EBEBEB] selection:bg-white selection:text-black">
      
      {/* Cinematic Lighting */}
      <div className="absolute top-[10%] left-[10%] w-[40vw] h-[40vw] bg-white/5 rounded-full blur-[100px] pointer-events-none z-0"></div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="vogue-card p-14 w-full max-w-md text-center z-10 flex flex-col items-center"
      >
        <div className="font-serif text-5xl font-black italic tracking-tighter mb-4 text-white">StyleIQ<span className="text-red-500">.</span></div>
        <p className="text-white/40 mb-10 font-sans text-xs uppercase tracking-[0.2em] font-bold">Authenticate Subsystem</p>
        
        {error && <div className="text-red-500 text-xs uppercase tracking-widest font-bold mb-6 bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20">{error}</div>}
        
        <form onSubmit={handleLogin} className="space-y-6 w-full">
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors placeholder-white/30 text-sm backdrop-blur-md"
          />
          <input 
            type="password" 
            placeholder="Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-black/40 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-white/40 transition-colors placeholder-white/30 text-sm backdrop-blur-md"
          />
          <button 
            type="submit" 
            className="w-full bg-white text-black font-bold p-4 rounded-full hover:scale-105 transition-transform text-xs uppercase tracking-[0.2em]"
          >
            Access Interface
          </button>
        </form>
        
        <Link to="/signup" className="block mt-8 text-[10px] text-white/30 hover:text-white uppercase tracking-[0.2em] transition-colors font-bold">
          Request Access Token
        </Link>
      </motion.div>
    </div>
  );
}
