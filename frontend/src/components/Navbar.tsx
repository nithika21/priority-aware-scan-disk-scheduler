import React, { useState, useEffect } from 'react';
import { HardDrive, Play } from 'lucide-react';

interface NavbarProps {
  onRunClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onRunClick }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Overview', href: '#overview' },
    { label: 'Simulator', href: '#simulator' },
    { label: 'Visualization', href: '#visualization' },
    { label: 'Analytics', href: '#analytics' },
    { label: 'Request Trace', href: '#request-analysis' },
    { label: 'How It Works', href: '#how-it-works' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#053229]/90 backdrop-blur-md border-b border-slate-800/80 py-3 shadow-2xl' 
        : 'bg-transparent py-5'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <HardDrive className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-white tracking-wide">SCAN</span>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                  OPTIMIZER v2.0
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-wider">PRIORITY-AWARE DISK SCHEDULER</p>
            </div>
          </a>

          {/* Nav Links */}
          <div className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1.5 rounded-full border border-slate-800/80">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="px-4 py-1.5 text-xs font-medium text-slate-300 hover:text-cyan-400 hover:bg-slate-800/60 rounded-full transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Action & Status */}
          <div className="flex items-center gap-4">
            <div className="hidden lg:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="font-mono text-[11px]">Ready to Simulate</span>
            </div>

            <button
              onClick={() => {
                const simulatorEl = document.getElementById('simulator');
                if (simulatorEl) simulatorEl.scrollIntoView({ behavior: 'smooth' });
                onRunClick();
              }}
              className="flex items-center gap-2 bg-cyan-500 hover:bg-cyan-600 text-white text-xs font-semibold px-4 py-2 rounded-xl active:scale-95 transition-colors cursor-pointer"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run Simulation</span>
            </button>
          </div>

        </div>
      </div>
    </nav>
  );
};
