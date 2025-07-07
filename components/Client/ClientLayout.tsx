'use client';

import { ReactNode } from 'react';
import ClientNavigation from './ClientNavigation';
import type { User } from '../../lib/types';

interface ClientLayoutProps {
  children: ReactNode;
  user: User;
}

export default function ClientLayout({ children, user }: ClientLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background Effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-2000" />
      </div>

      {/* Navigation */}
      <ClientNavigation user={user} />

      {/* Main Content */}
      <main className="relative z-10">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-glass backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2025 uniQubit. All rights reserved. | 
              <span className="text-neon"> Client Portal</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
