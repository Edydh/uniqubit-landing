'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      {/* Auth Card */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md"
      >
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <Link href="/">
            <motion.h1
              className="text-4xl font-display font-bold text-white mb-2 cursor-pointer"
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-neon">uni</span>Qubit
            </motion.h1>
          </Link>
          <p className="text-gray-400 text-sm">
            Back to{' '}
            <Link href="/" className="text-neon hover:text-neon/80 transition-colors">
              homepage
            </Link>
          </p>
        </div>

        {/* Auth Form Container */}
        <motion.div
          className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
            {subtitle && (
              <p className="text-gray-400 text-sm">{subtitle}</p>
            )}
          </div>

          {/* Form Content */}
          {children}
        </motion.div>

        {/* Footer */}
        <div className="text-center mt-6 text-gray-500 text-sm">
          <p>© 2024 uniQubit. All rights reserved.</p>
        </div>
      </motion.div>
    </div>
  );
}
