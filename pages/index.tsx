import Head from 'next/head';
import dynamic from 'next/dynamic';
import Navigation from '../components/Navigation';
import Hero from '../components/Hero';

// Lazy load components for better performance
const Services = dynamic(() => import('../components/Services'), {
  loading: () => <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>,
  ssr: false // Prevent hydration mismatch by rendering only on client
});

const About = dynamic(() => import('../components/About'), {
  loading: () => <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
});

const ContactForm = dynamic(() => import('../components/ContactForm'), {
  loading: () => <div className="min-h-screen flex items-center justify-center">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
  </div>
});

const Footer = dynamic(() => import('../components/Footer'), {
  loading: () => <div className="h-64 bg-background border-t border-white/5"></div>
});

export default function Home() {
  return (
    <>
      <Head>
        <link rel="icon" type="image/png" href="/favicon.png" />
        <title>uniQubit – AI-powered app development & ML consulting agency</title>
        <meta name="description" content="Transform your ideas into reality with uniQubit's premium software development services. Specializing in AI-ready solutions, modern web applications, and scalable systems using Next.js, TypeScript, and cutting-edge technologies." />
        <meta name="keywords" content="software development, web development, AI solutions, Next.js, TypeScript, React, mobile apps, SaaS, custom software, Toronto software agency" />
        <meta name="author" content="uniQubit" />
        <meta name="robots" content="index, follow" />
        <meta name="language" content="en" />
        <meta name="revisit-after" content="7 days" />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://uniqubit.ca/" />
        <meta property="og:title" content="uniQubit – Premium Software Development Agency" />
        <meta property="og:description" content="Transform your ideas into reality with premium software development services. AI-ready solutions, modern web applications, and scalable systems." />
        <meta property="og:site_name" content="uniQubit" />
        <meta property="og:locale" content="en_US" />
        
        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://uniqubit.ca/" />
        <meta property="twitter:title" content="uniQubit – Premium Software Development Agency" />
        <meta property="twitter:description" content="Transform your ideas into reality with premium software development services. AI-ready solutions and modern web applications." />
        
        {/* Additional SEO */}
        <meta name="theme-color" content="#0c0c0c" />
        <meta name="msapplication-TileColor" content="#0c0c0c" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <link rel="canonical" href="https://uniqubit.ca/" />
        <link rel="icon" href="/favicon.ico" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "uniQubit",
              "url": "https://uniqubit.ca",
              "description": "Premium software development agency specializing in AI-ready solutions and modern web applications",
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "customer service",
                "email": "hello@uniqubit.ca"
              },
              "sameAs": [
                "https://linkedin.com/company/uniqubit",
                "https://twitter.com/uniqubit"
              ]
            })
          }}
        />
      </Head>
      
      <Navigation />
      
      <main className="bg-background text-white min-h-screen font-sans scroll-smooth">
        <section id="hero">
          <Hero />
        </section>
        <section id="services">
          <Services />
        </section>
        <section id="about">
          <About />
        </section>
        <section id="contact">
          <ContactForm />
        </section>
      </main>
      
      <Footer />
    </>
  );
}
