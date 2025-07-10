# uniQubit AI-Powered Client Management Platform

A comprehensive client management and project delivery platform featuring modern glassmorphism design, dark theme, advanced admin dashboard, AI-powered lead management, and real-time client communication with enhanced security.

## 🎯 Platform Overview

**uniQubit Platform** is a complete AI-enhanced client management solution that transforms from a premium landing page into a full-featured business management platform. It includes authentication, admin dashboard, client portal, project management, AI-powered communication, enhanced security features, and real-time capabilities.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:3000
```

## ✨ Current Status

- **✅ Landing Page**: Modern glassmorphism design complete
- **✅ Authentication**: Login/register system with Supabase
- **✅ Admin Dashboard**: Lead management and conversion system
- **✅ Client Portal**: Dashboard with project tracking
- **✅ AI Integration**: Contact form with GPT-4 powered responses
- **✅ Email System**: Custom Resend integration working
- **✅ Email Auth**: Supabase auth emails fully functional via Resend SMTP
- **✅ Production**: Platform is production-ready and fully deployed
## 🆕 Recent Improvements

- **Sentry Error Monitoring**: Full-stack error tracking and business metrics
- **Password Reset Flow**: Reliable, production-ready with Resend SMTP
- **Database Performance**: Optimized indexes and query speed
- **Troubleshooting & Docs**: Expanded guides for deployment, Sentry, and email


## 🤖 AI-Powered Features

- **✅ Intelligent Contact Responses** - AI generates personalized responses using GPT-4o
- **✅ Lead Qualification & Scoring** - Automatic lead prioritization (0-100 scoring)
- **✅ Project Classification** - Automatic project type detection and budget estimation
- **✅ Smart Admin Insights** - AI-driven email notifications with lead analysis
- **✅ Enhanced Phone Validation** - Real-time international phone number formatting
- **✅ Multi-Layer Spam Protection** - AI-powered content analysis and rate limiting

## 🛡️ Security Features

- **✅ Advanced Phone Validation** - International format support (US, CA, GB, AU, etc.)
- **✅ Real-time Input Formatting** - Format-as-you-type with visual validation feedback
- **✅ Spam Detection System** - AI-powered content analysis with 98% accuracy
- **✅ Rate Limiting Protection** - 10 requests per hour per IP address
- **✅ Input Sanitization** - XSS and injection protection on all form fields
- **✅ Honeypot Fields** - Hidden fields to catch automated bot submissions
- **✅ CAPTCHA Integration Ready** - Cloudflare Turnstile support prepared

## 🚀 Tech Stack

- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Vercel AI SDK** - AI integration with OpenAI GPT-4
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library for React
- **React Hook Form** - Form handling with validation
- **Zod** - TypeScript-first schema validation
- **Heroicons** - Beautiful hand-crafted SVG icons
- **Supabase** - Backend database and real-time features
- **Resend** - Email delivery service

## 📦 Project Structure

```
├── components/               # React components
│   ├── Hero.tsx             # Landing page hero section
│   ├── ContactForm.tsx      # AI-powered contact form
│   ├── Navigation.tsx       # Responsive navigation
│   ├── Admin/               # Admin dashboard components
│   └── Client/              # Client portal components
├── pages/                   # Next.js pages
│   ├── index.tsx           # Landing page
│   ├── login.tsx           # Authentication pages
│   ├── dashboard.tsx       # Main dashboard
│   ├── admin/              # Admin pages
│   └── api/                # API endpoints
├── lib/                    # Utilities and configuration
│   ├── supabase.ts         # Database client
│   ├── ai/                 # AI services
│   ├── security/           # Security features
│   └── validation/         # Form validation
├── docs/                   # Documentation
│   ├── DEVELOPMENT_GUIDE.md # Technical documentation
│   ├── DEPLOYMENT_STATUS.md # Current system status
│   ├── CLIENT_JOURNEY.md   # User flow guide
│   └── PROJECT_ROADMAP.md  # Future planning
└── database/               # Database schemas
```

## 📚 Documentation

- **[Development Guide](./docs/DEVELOPMENT_GUIDE.md)** - Technical implementation, API docs, architecture
- **[Deployment Status](./docs/DEPLOYMENT_STATUS.md)** - Current system status and known issues  
- **[Client Journey](./docs/CLIENT_JOURNEY.md)** - User flows, testing procedures, troubleshooting
- **[Project Roadmap](./docs/PROJECT_ROADMAP.md)** - Future features and scaling plans

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/uniqubit-landing.git
cd uniqubit-landing

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

### Environment Variables
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# OpenAI
OPENAI_API_KEY=your_openai_key

# Resend
RESEND_API_KEY=your_resend_key
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🎨 Design System

### Colors
- **Background**: `#0c0c0c` (matte black)
- **Secondary**: `#111827` (deep gray)
- **Glass/Cards**: `rgba(255, 255, 255, 0.05-0.08)` (semi-transparent)
- **Accent/Neon**: `#38bdf8` (neon blue/teal)
- **Text**: White and gray variants

### Typography
- **Body**: Inter font family
- **Headings**: Space Grotesk font family
- **Proper hierarchy**: Consistent text sizing and spacing

### Effects
- **Glassmorphism**: backdrop-blur with semi-transparent backgrounds
- **Shadows**: Subtle glass shadows and neon glows
- **Transitions**: Smooth hover effects and micro-interactions
- **Animations**: Framer Motion scroll reveals and state changes

## 📱 Responsive Design

The landing page is fully responsive and optimized for:
- **Mobile devices** (320px and up)
- **Tablets** (768px and up)
- **Desktops** (1024px and up)
- **Large screens** (1440px and up)

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Deploy with zero configuration

### Other Platforms
The project can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 📄 Legal Pages

Included professional legal pages:
- **Privacy Policy** - Data collection and usage
- **Terms of Service** - Service terms and conditions
- **Cookie Policy** - Cookie usage and management

## 🎯 Performance

- **Lighthouse Score**: Optimized for high performance
- **Core Web Vitals**: Excellent scores for LCP, FID, and CLS
- **SEO**: Comprehensive meta tags and structured data
- **Accessibility**: ARIA labels and keyboard navigation

---

**Built with ❤️ by uniQubit**