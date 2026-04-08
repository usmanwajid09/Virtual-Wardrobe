import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password })
      });
      const data = await res.json();
      
      if (res.ok && data.token) {
        localStorage.setItem('styleiq_token', data.token);
        navigate('/dashboard');
      } else {
        setError(data.error || 'Registration failed.');
      }
    } catch (err) {
      setError('Network error.');
    }
  };

  return (
    <div className="h-screen bg-premium-gradient flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card p-12 w-full max-w-md text-center shadow-[0_25px_50px_rgba(0,0,0,0.5)]"
      >
        <div className="font-serif text-4xl text-white mb-2">Style<span className="text-primary">IQ</span></div>
        <p className="text-gray-400 mb-8 font-sans">Create your premium fashion profile.</p>
        
        {error && <div className="text-red-400 text-sm mb-4">{error}</div>}
        
        <form onSubmit={handleSignup} className="space-y-4">
          <input 
            type="text" 
            placeholder="Full Name" 
            required 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
          <input 
            type="email" 
            placeholder="Email Address" 
            required 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
          <input 
            type="password" 
            placeholder="Create Password" 
            required 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-white/5 border border-white/10 p-4 rounded-xl text-white focus:outline-none focus:border-primary/50 transition-colors"
          />
          <button 
            type="submit" 
            className="w-full bg-primary text-black font-bold p-4 rounded-xl hover:bg-white transition-colors"
          >
            Create Account
          </button>
        </form>
        
        <Link to="/login" className="block mt-6 text-sm text-gray-400 hover:text-white transition-colors">
          Already have an account? Sign in.
        </Link>
      </motion.div>
    </div>
  );
}
