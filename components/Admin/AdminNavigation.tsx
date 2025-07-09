'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from '../../lib/auth';
import type { User } from '../../lib/types';

interface AdminNavigationProps {
  currentUser: User | null;
}

export default function AdminNavigation({ currentUser }: AdminNavigationProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // If no user, show minimal navigation
  if (!currentUser) {
    return (
      <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/admin/dashboard" className="text-2xl font-bold bg-gradient-to-r from-neon to-purple-400 bg-clip-text text-transparent">
                uniQubit
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const navItems = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: '📊' },
    { name: 'Leads', href: '/admin/leads', icon: '🎯' },
    { name: 'Projects', href: '/admin/projects', icon: '📋' },
    { name: 'Clients', href: '/admin/clients', icon: '👥' },
    { name: 'Messages', href: '/admin/messages', icon: '💬' },
    { name: 'Analytics', href: '/admin/analytics', icon: '📈' },
  ];

  const handleSignOut = async () => {
    setIsLoading(true);
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const isActivePath = (path: string) => {
    return router.pathname === path;
  };

  return (
    <nav className="bg-glass backdrop-blur-xl border-b border-white/10 shadow-glass sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/admin/dashboard">
            <motion.div
              className="flex items-center space-x-3 cursor-pointer"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-neon to-purple-400 rounded-lg flex items-center justify-center">
                <span className="text-black font-bold text-sm">🛡️</span>
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-white">
                  <span className="text-neon">uni</span>Qubit Admin
                </h1>
                <p className="text-gray-400 text-xs">Management Dashboard</p>
              </div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                    isActivePath(item.href)
                      ? 'bg-neon/10 text-neon border border-neon/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">
                  {currentUser.full_name?.[0] || currentUser.email[0].toUpperCase()}
                </span>
              </div>
              <div className="hidden md:block text-right">
                <p className="text-white text-sm font-medium">
                  {currentUser.full_name || 'Admin'}
                </p>
                <p className="text-gray-400 text-xs capitalize">
                  {currentUser.role}
                </p>
              </div>
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </motion.button>

            {/* Dropdown Menu */}
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-glass backdrop-blur-xl border border-white/10 rounded-lg shadow-glass overflow-hidden"
              >
                <div className="p-4 border-b border-white/10">
                  <p className="text-white font-medium">{currentUser.full_name}</p>
                  <p className="text-gray-400 text-sm">{currentUser.email}</p>
                </div>
                <div className="p-2">
                  <Link href="/admin/profile">
                    <motion.div
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="text-sm">Profile</span>
                    </motion.div>
                  </Link>
                  <Link href="/admin/settings">
                    <motion.div
                      className="flex items-center space-x-2 px-3 py-2 text-gray-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                      whileHover={{ scale: 1.02 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span className="text-sm">Settings</span>
                    </motion.div>
                  </Link>
                  <div className="border-t border-white/10 mt-2 pt-2">
                    <motion.button
                      onClick={handleSignOut}
                      disabled={isLoading}
                      className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/5 rounded-lg transition-colors w-full disabled:opacity-50"
                      whileHover={{ scale: 1.02 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                      <span className="text-sm">
                        {isLoading ? 'Signing out...' : 'Sign out'}
                      </span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="flex items-center space-x-2 overflow-x-auto pb-2">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-300 whitespace-nowrap ${
                    isActivePath(item.href)
                      ? 'bg-neon/10 text-neon border border-neon/20'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.name}
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
