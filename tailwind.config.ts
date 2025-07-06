import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
      },
      colors: {
        background: '#0c0c0c',
        card: 'rgba(255, 255, 255, 0.05)',
        neon: '#38bdf8',
        glass: 'rgba(255, 255, 255, 0.08)',
      },
      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },
      boxShadow: {
        glass: '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};

export default config;

// This file is used to configure Tailwind CSS for the project.
// It specifies the dark mode strategy, the content paths to scan for class names,
// extends the default theme, and includes the Tailwind CSS forms plugin for better form styling.
// The `content` array includes paths to all pages and components, ensuring that Tailwind can
// purge unused styles in production builds. The `darkMode` is set to 'class',