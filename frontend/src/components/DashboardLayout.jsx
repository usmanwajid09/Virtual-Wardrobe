import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, Layers, Calendar, Bot, LogOut, Settings2 } from 'lucide-react';
import Magnetic from './Magnetic';

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const token = localStorage.getItem('styleiq_token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  const navLinks = [
    { path: '/dashboard/wardrobe', label: 'Wardrobe', icon: Camera },
    { path: '/dashboard/outfits', label: 'Outfits', icon: Layers },
    { path: '/dashboard/events', label: 'Calendar', icon: Calendar },
    { path: '/dashboard/stylist', label: 'Style Coach', icon: Bot },
  ];

  const handleLogout = () => {
    localStorage.removeItem('styleiq_token');
    navigate('/login');
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] text-[#EBEBEB] overflow-hidden font-sans relative selection:bg-white selection:text-black">
      
      {/* Background Ambient Lights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-white/5 rounded-full blur-[150px] mix-blend-screen pointer-events-none z-0"></div>
      <div className="absolute bottom-[20%] right-[-10%] w-[40vw] h-[40vw] bg-red-900/10 rounded-full blur-[120px] mix-blend-screen pointer-events-none z-0"></div>

      {/* Main Content Area - Full Bleed */}
      <main className="flex-1 overflow-y-auto px-6 py-10 relative z-10 custom-scrollbar pb-32">
         <Outlet />
      </main>

      {/* Ultra-Premium Glass Dock (macOS style Bottom Nav) */}
      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
        <Magnetic>
          <div className="glass-dock px-6 py-4 rounded-full flex items-center gap-6">
              
              {/* App Brand Logo */}
              <div className="mr-4 ml-2 border-r border-white/10 pr-6 hidden sm:block">
                  <div className="font-serif text-lg font-black italic tracking-tight">StyleIQ</div>
              </div>

              {/* Navigation Nodes */}
              <nav className="flex items-center gap-2">
                {navLinks.map((link) => {
                  const isActive = location.pathname.includes(link.path) || (location.pathname === '/dashboard' && link.path === '/dashboard/wardrobe');
                  return (
                      <Link 
                        key={link.path}
                        to={link.path}
                        className="relative group p-3 rounded-full transition-all duration-300 block"
                      >
                        {isActive && (
                          <motion.div 
                            layoutId="dockHighlight"
                            className="absolute inset-0 bg-white/10 rounded-full shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]"
                            initial={false}
                            transition={{ type: "spring", stiffness: 400, damping: 30 }}
                          />
                        )}
                        <div className={`relative flex items-center justify-center z-10 ${isActive ? 'text-white' : 'text-white/40 group-hover:text-white/80'}`}>
                          <link.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                        </div>
                        {/* Tooltip */}
                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-[0.2em] pointer-events-none transition-opacity border border-white/10 whitespace-nowrap hidden sm:block">
                           {link.label}
                        </div>
                      </Link>
                  );
                })}
              </nav>

              {/* Utility Nodes */}
              <div className="ml-4 pl-6 border-l border-white/10 flex items-center gap-4">
                 <button className="text-white/40 hover:text-white transition-colors p-2 rounded-full hover:bg-white/5">
                    <Settings2 size={18} strokeWidth={1.5} />
                 </button>
                 <button onClick={handleLogout} className="text-red-500/50 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-500/10">
                    <LogOut size={18} strokeWidth={1.5} />
                 </button>
                 
                 {/* Profile Node */}
                 <div className="w-10 h-10 rounded-full bg-cover bg-center border border-white/20 shadow-lg ml-2" style={{backgroundImage: "url('https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80')"}}>
                 </div>
              </div>
          </div>
        </Magnetic>
      </div>

    </div>
  );
}
