'use client';

import { ReactNode } from 'react';
import AdminNavigation from './AdminNavigation';
import type { User } from '../../lib/types';

interface AdminLayoutProps {
  children: ReactNode;
  currentUser: User;
  title?: string;
  subtitle?: string;
}

export default function AdminLayout({ children, currentUser, title, subtitle }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Navigation */}
      <AdminNavigation currentUser={currentUser} />

      {/* Main Content */}
      <main className="relative z-10">
        {/* Page Header */}
        {(title || subtitle) && (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="mb-8">
              {title && (
                <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
              )}
              {subtitle && (
                <p className="text-gray-400">{subtitle}</p>
              )}
            </div>
          </div>
        )}

        {/* Page Content */}
        <div className="max-w-7xl mx-auto px-6 pb-8">
          {children}
        </div>
      </main>
    </div>
  );
}
