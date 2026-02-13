'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '📋' },
  { href: '/patients', label: 'Pacjenci', icon: '👥' },
  { href: '/plans', label: 'Plany', icon: '📑' },
  { href: '/exercises', label: 'Ćwiczenia', icon: '🏋️' },
  { href: '/stats', label: 'Statystyki', icon: '📊' },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  const handleNavClick = () => {
    onClose();
  };

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/80 backdrop-blur-sm z-40 transition-opacity duration-300 md:hidden ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 min-h-screen p-4 z-50 transform transition-transform duration-300 ease-in-out md:transform-none ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(26, 26, 37, 0.95) 0%, rgba(10, 10, 15, 0.98) 100%)',
          borderRight: '1px solid rgba(0, 240, 255, 0.2)',
        }}
      >
        <div className="mb-8 flex items-center justify-between">
          <h1 className="text-xl font-bold gradient-text">Rehab Planner</h1>
          <button
            onClick={onClose}
            className="md:hidden p-1.5 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
            aria-label="Zamknij menu"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <nav className="space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={handleNavClick}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all duration-300 ${
                pathname === item.href
                  ? 'bg-gradient-to-r from-neon-cyan/20 to-neon-purple/20 text-neon-cyan border border-neon-cyan/30'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-8 left-4 right-4">
          <div className="glass-card rounded-xl p-4">
            <p className="text-xs text-white/40 mb-1">Wersja</p>
            <p className="text-sm gradient-text font-semibold">1.0.0</p>
          </div>
        </div>
      </aside>
    </>
  );
}
