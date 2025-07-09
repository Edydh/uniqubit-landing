'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from '../../lib/auth';
import type { User } from '../../lib/types';

interface ClientNavigationProps {
  user: User | null;
}

export default function ClientNavigation({ user }: ClientNavigationProps) {
  const router = useRouter();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // If no user, show minimal navigation
  if (!user) {
    return (
      <nav className="bg-black/30 backdrop-blur-xl border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/client/dashboard" className="text-2xl font-bold bg-gradient-to-r from-neon to-purple-400 bg-clip-text text-transparent">
                uniQubit
              </Link>
            </div>
          </div>
        </div>
      </nav>
    );
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/client/dashboard', icon: '🏠' },
    { name: 'Projects', href: '/client/projects', icon: '📋' },
    { name: 'Messages', href: '/client/messages', icon: '💬' },
    { name: 'Files', href: '/client/files', icon: '📁' },
  ];

  return (
    <nav className="bg-glass backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/client/dashboard">
            <motion.div
              className="flex items-center space-x-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <div className="text-2xl font-display font-bold text-white">
                <span className="text-neon">uni</span>Qubit
              </div>
              <div className="text-sm text-gray-400">Client Portal</div>
            </motion.div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-300 cursor-pointer ${
                    router.pathname === item.href
                      ? 'bg-neon/10 text-neon border border-neon/20'
                      : 'text-gray-300 hover:text-neon hover:bg-white/5'
                  }`}
                  whileHover={{ y: -2 }}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <motion.button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 transition-colors duration-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="w-8 h-8 bg-gradient-to-r from-neon to-purple-400 rounded-full flex items-center justify-center">
                <span className="text-black font-semibold text-sm">
                  {user.full_name?.[0] || user.email[0].toUpperCase()}
                </span>
              </div>
              <div className="text-left hidden md:block">
                <p className="text-white font-medium text-sm">{user.full_name || 'Client'}</p>
                <p className="text-gray-400 text-xs">{user.email}</p>
              </div>
              <motion.svg
                className="w-4 h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                animate={{ rotate: isProfileOpen ? 180 : 0 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </motion.svg>
            </motion.button>

            {/* Profile Dropdown Menu */}
            {isProfileOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute right-0 mt-2 w-48 bg-glass backdrop-blur-xl border border-white/10 rounded-lg shadow-glass overflow-hidden"
              >
                <div className="py-2">
                  <Link href="/client/profile">
                    <div className="px-4 py-2 hover:bg-white/5 transition-colors cursor-pointer">
                      <p className="text-white text-sm">Profile Settings</p>
                    </div>
                  </Link>
                  <Link href="/client/notifications">
                    <div className="px-4 py-2 hover:bg-white/5 transition-colors cursor-pointer">
                      <p className="text-white text-sm">Notifications</p>
                    </div>
                  </Link>
                  <div className="border-t border-white/10 my-2" />
                  <button
                    onClick={handleSignOut}
                    className="w-full px-4 py-2 text-left hover:bg-red-500/10 transition-colors"
                  >
                    <p className="text-red-400 text-sm">Sign Out</p>
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden mt-4">
          <div className="flex space-x-2 overflow-x-auto">
            {navItems.map((item) => (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-all duration-300 ${
                    router.pathname === item.href
                      ? 'bg-neon/10 text-neon border border-neon/20'
                      : 'text-gray-300 hover:text-neon hover:bg-white/5'
                  }`}
                  whileTap={{ scale: 0.95 }}
                >
                  <span>{item.icon}</span>
                  <span className="text-sm font-medium">{item.name}</span>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
