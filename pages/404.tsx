import Head from 'next/head';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Custom404() {
  return (
    <>
      <Head>
        <title>404 - Page Not Found | uniQubit</title>
        <meta name="description" content="The page you're looking for couldn't be found." />
        <meta name="robots" content="noindex, nofollow" />
      </Head>
      
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative mb-8"
          >
            <h1 className="text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent font-heading">
              404
            </h1>
            <div className="absolute inset-0 text-8xl md:text-9xl font-bold text-primary/10 blur-sm">
              404
            </div>
          </motion.div>

          {/* Content */}
          <div className="max-w-md mx-auto mb-8">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-2xl md:text-3xl font-semibold text-white mb-4 font-heading"
            >
              Page Not Found
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-gray-300 text-lg leading-relaxed mb-8"
            >
              The page you're looking for seems to have vanished into the digital void. 
              Don't worry, even the best code has bugs sometimes.
            </motion.p>
          </div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/"
              className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white font-semibold rounded-xl hover:shadow-neon transition-all duration-300 transform hover:scale-105"
            >
              Back to Home
            </Link>
            <Link
              href="#contact"
              className="px-8 py-4 bg-glass backdrop-blur-sm border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              Contact Us
            </Link>
          </motion.div>

          {/* Decorative Elements */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-primary/5 to-accent/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-accent/10 rounded-full blur-xl pointer-events-none" />
        </motion.div>
      </div>
    </>
  );
}
