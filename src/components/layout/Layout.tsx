'use client';

import { useState } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col min-w-0">
        <header 
          className="md:hidden px-4 py-3 flex items-center gap-4 sticky top-0 z-30"
          style={{
            background: 'linear-gradient(180deg, rgba(26, 26, 37, 0.95) 0%, rgba(18, 18, 26, 0.9) 100%)',
            borderBottom: '1px solid rgba(0, 240, 255, 0.2)',
            backdropFilter: 'blur(20px)',
          }}
        >
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-xl hover:bg-white/10 transition-colors"
            aria-label="Otwórz menu"
          >
            <svg className="w-6 h-6 text-[#00f0ff]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="text-lg font-bold gradient-text">Rehab Planner</h1>
        </header>
        
        <main className="flex-1 p-4 md:p-8 relative z-10">
          {children}
        </main>
      </div>
    </div>
  );
}
