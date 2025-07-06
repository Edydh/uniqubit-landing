'use client';

import { motion } from 'framer-motion';

const services = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    title: "Web & Mobile Apps",
    description: "Full-stack development with modern frameworks like Next.js, React Native, and Supabase.",
    delay: 0
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>
    ),
    title: "AI Integrations",
    description: "Future-proof your app with GPT-powered logic, automation, and intelligent UX.",
    delay: 0.2
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: "Custom Dashboards",
    description: "Track, analyze, and visualize your business data with tailored UIs and powerful backend logic.",
    delay: 0.4
  }
];

// Animation variants
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

const cardVariants = {
  hidden: { 
    opacity: 0, 
    y: 50,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6
    }
  }
};

const iconVariants = {
  rest: { 
    rotate: 0,
    scale: 1
  },
  hover: { 
    rotate: 360,
    scale: 1.2,
    transition: {
      duration: 0.6
    }
  }
};

export default function Services() {
  return (
    <section id="services" className="py-20 px-6 bg-background relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div 
        className="absolute top-1/4 left-1/4 w-64 h-64 bg-neon/5 rounded-full blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: [0.6, -0.05, 0.01, 0.99] as const
        }}
      />
      <motion.div 
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon/3 rounded-full blur-3xl"
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.4, 0.2],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: [0.6, -0.05, 0.01, 0.99] as const
        }}
      />
      
      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="font-display text-4xl md:text-5xl font-bold mb-6 text-white"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
          >
            What We Build
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-400 max-w-2xl mx-auto"
            whileInView={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Cutting-edge solutions tailored to your business needs
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              variants={cardVariants}
              whileHover={{ 
                scale: 1.05,
                rotateY: 5,
                transition: { duration: 0.3 }
              }}
              className="bg-glass backdrop-blur-md border border-white/10 shadow-glass p-8 rounded-2xl text-center group hover:border-neon/50 transition-all duration-500 relative overflow-hidden"
            >
              {/* Card glow effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-neon/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              
              <motion.div 
                className="text-neon mb-6 flex justify-center relative z-10"
                variants={iconVariants}
                initial="rest"
                whileHover="hover"
              >
                {service.icon}
              </motion.div>
              
              <motion.h3 
                className="font-display text-xl font-semibold mb-4 text-white group-hover:text-neon transition-colors duration-500 relative z-10"
                whileHover={{ scale: 1.05 }}
              >
                {service.title}
              </motion.h3>
              
              <motion.p 
                className="text-gray-300 leading-relaxed relative z-10"
                whileHover={{ y: -2 }}
                transition={{ duration: 0.3 }}
              >
                {service.description}
              </motion.p>

              {/* Animated border */}
              <motion.div
                className="absolute inset-0 border-2 border-transparent group-hover:border-neon/30 rounded-2xl"
                initial={{ rotate: 0 }}
                whileHover={{ rotate: 1 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
