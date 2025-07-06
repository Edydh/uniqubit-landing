'use client';

import { motion } from 'framer-motion';

const stats = [
  { value: "50+", label: "Projects Delivered", delay: 0 },
  { value: "5+", label: "Years Experience", delay: 0.2 },
  { value: "24/7", label: "Support Available", delay: 0.4 }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6
    }
  }
};

const statVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      type: "spring" as const,
      bounce: 0.4
    }
  }
};

export default function About() {
  return (
    <section className="py-20 px-6 bg-background relative overflow-hidden">
      {/* Background animated elements */}
      <motion.div 
        className="absolute top-0 left-0 w-full h-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        <div className="absolute top-1/3 left-1/3 w-32 h-32 bg-neon/10 rounded-full blur-2xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/3 w-48 h-48 bg-neon/5 rounded-full blur-3xl animate-pulse" />
      </motion.div>

      <div className="max-w-6xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="bg-glass backdrop-blur-md border border-white/10 shadow-glass p-12 md:p-16 rounded-2xl text-center hover:border-neon/30 transition-all duration-500 group"
        >
          {/* Animated border glow */}
          <motion.div
            className="absolute inset-0 rounded-2xl bg-gradient-to-r from-neon/20 via-transparent to-neon/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            animate={{
              backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear"
            }}
          />

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="relative z-10"
          >
            <motion.h2 
              variants={itemVariants}
              className="font-display text-4xl md:text-5xl font-bold mb-8 text-white"
            >
              About{' '}
              <motion.span 
                className="text-neon"
                whileHover={{ scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                uniQubit
              </motion.span>
            </motion.h2>
            
            <motion.div
              variants={itemVariants}
              className="max-w-4xl mx-auto"
            >
              <motion.p 
                className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed"
                whileInView={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
                viewport={{ once: true }}
              >
                We are a forward-thinking development agency focused on elegant design, 
                cutting-edge technology, and building AI-ready applications for startups, 
                enterprises, and creators who think big.
              </motion.p>
              
              <motion.div 
                className="grid md:grid-cols-3 gap-8 mt-12"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                {stats.map((stat, index) => (
                  <motion.div
                    key={stat.label}
                    variants={statVariants}
                    whileHover={{ 
                      scale: 1.1,
                      transition: { duration: 0.3 }
                    }}
                    className="text-center group cursor-pointer"
                  >
                    <motion.div 
                      className="text-4xl md:text-5xl font-bold text-neon mb-2 group-hover:text-white transition-colors duration-300"
                      animate={{ 
                        textShadow: ["0px 0px 0px rgba(56, 189, 248, 0)", "0px 0px 20px rgba(56, 189, 248, 0.5)", "0px 0px 0px rgba(56, 189, 248, 0)"]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: stat.delay
                      }}
                    >
                      {stat.value}
                    </motion.div>
                    <motion.div 
                      className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300"
                      whileHover={{ y: -2 }}
                    >
                      {stat.label}
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
