'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { enhancedContactSchema } from '@/lib/security/spamDetection';
import { PhoneInput } from './PhoneInput';
import * as gtag from '../lib/analytics';

type ContactFormData = z.infer<typeof enhancedContactSchema>;

// Declare Turnstile for TypeScript
declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: any) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [turnstileToken, setTurnstileToken] = useState<string>('');
  const [turnstileWidgetId, setTurnstileWidgetId] = useState<string>('');
  const [rateLimitError, setRateLimitError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    control,
  } = useForm<ContactFormData>({
    resolver: zodResolver(enhancedContactSchema),
  });

  // Load Turnstile script and initialize
  useEffect(() => {
    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
    if (!siteKey) return; // CAPTCHA not configured

    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) {
        const widgetId = window.turnstile.render('#turnstile-widget', {
          sitekey: siteKey,
          callback: (token: string) => {
            setTurnstileToken(token);
          },
          'error-callback': () => {
            setTurnstileToken('');
            console.error('Turnstile error occurred');
          },
          'expired-callback': () => {
            setTurnstileToken('');
          },
          theme: 'light',
          size: 'normal',
        });
        setTurnstileWidgetId(widgetId);
      }
    };
    document.head.appendChild(script);

    return () => {
      if (turnstileWidgetId && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId);
      }
      document.head.removeChild(script);
    };
  }, []);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setRateLimitError('');
    
    try {
      // Check if CAPTCHA is required and present
      const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
      if (siteKey && !turnstileToken) {
        throw new Error('Please complete the security verification');
      }

      // Use the basic contact endpoint (AI endpoint has dependency issues)
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          turnstileToken: turnstileToken || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        
        // Handle rate limiting specifically
        if (response.status === 429) {
          const retryAfter = errorData.retryAfter || 900; // Default 15 minutes
          setRateLimitError(`Too many requests. Please try again in ${Math.ceil(retryAfter / 60)} minutes.`);
          throw new Error(errorData.error);
        }
        
        throw new Error(errorData.error || 'Failed to send message');
      }

      const result = await response.json();
      console.log('Contact form submitted successfully:', result);
      
      // Track successful contact form submission
      gtag.trackContactForm(data.email, data.name);
      
      setSubmitStatus('success');
      reset();
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 px-6 bg-background">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-6 text-white">
            Let's Build Together
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Ready to transform your ideas into reality? Get in touch and let's create something amazing.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="bg-glass backdrop-blur-md border border-white/10 shadow-glass p-8 md:p-12 rounded-2xl"
        >
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Name
                </label>
                <input
                  {...register('name')}
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-400">{errors.name.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Your Email
                </label>
                <input
                  {...register('email')}
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                  Company <span className="text-gray-500">(optional)</span>
                </label>
                <input
                  {...register('company')}
                  type="text"
                  id="company"
                  className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300"
                  placeholder="Enter your company name"
                />
                {errors.company && (
                  <p className="mt-1 text-sm text-red-400">{errors.company.message}</p>
                )}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-300 mb-2">
                  Phone <span className="text-gray-500">(optional)</span>
                </label>
                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <PhoneInput
                      {...field}
                      id="phone"
                      placeholder="Your phone number"
                      defaultCountry="US"
                      formatAsYouType={true}
                      showCountryCode={true}
                      className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300"
                      errorClassName="text-red-400"
                      onChange={(value, isValid) => {
                        field.onChange(value);
                      }}
                    />
                  )}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-400">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="projectType" className="block text-sm font-medium text-gray-300 mb-2">
                Project Type
              </label>
              <select
                {...register('projectType')}
                id="projectType"
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300"
              >
                <option value="">Select a project type</option>
                <option value="web-development">Web Development</option>
                <option value="mobile-app">Mobile App Development</option>
                <option value="e-commerce">E-commerce Solution</option>
                <option value="custom-software">Custom Software</option>
                <option value="consultation">Consultation</option>
                <option value="maintenance">Maintenance & Support</option>
                <option value="other">Other</option>
              </select>
              {errors.projectType && (
                <p className="mt-1 text-sm text-red-400">{errors.projectType.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                Your Message
              </label>
              <textarea
                {...register('message')}
                id="message"
                rows={6}
                className="w-full px-4 py-3 bg-black/50 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300 resize-none"
                placeholder="Tell us about your project requirements, timeline, and budget..."
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-400">{errors.message.message}</p>
              )}
            </div>

            {/* Honeypot field - hidden from users but visible to bots */}
            <div style={{ display: 'none' }}>
              <label htmlFor="website">Website (leave blank)</label>
              <input
                {...register('website')}
                type="text"
                id="website"
                tabIndex={-1}
                autoComplete="off"
              />
            </div>

            {/* Turnstile CAPTCHA Widget */}
            {process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY && (
              <div className="flex justify-center">
                <div id="turnstile-widget"></div>
              </div>
            )}

            {/* Rate limit error display */}
            {rateLimitError && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4">
                <p className="text-red-400 text-center">{rateLimitError}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 17 }}
                className="bg-neon hover:bg-neon/90 text-black font-semibold px-8 py-4 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-neon/25 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 inline-flex items-center gap-2 text-lg group relative overflow-hidden"
              >
                {/* Button background animation */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                
                <span className="relative z-10">
                  {isSubmitting ? (
                    <>
                      <motion.svg 
                        className="w-5 h-5 mr-2" 
                        fill="none" 
                        viewBox="0 0 24 24"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </motion.svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      Send Message
                      <motion.svg 
                        className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                        whileHover={{ rotate: 15 }}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </motion.svg>
                    </>
                  )}
                </span>
              </motion.button>
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-4 bg-green-500/20 border border-green-500/50 rounded-xl"
              >
                <p className="text-green-400 font-medium mb-2">✨ Message sent successfully!</p>
                <p className="text-green-300 text-sm">You should receive an instant AI-powered response in your inbox. We'll follow up personally within 24 hours.</p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center p-4 bg-red-500/20 border border-red-500/50 rounded-xl"
              >
                <p className="text-red-400 font-medium">Something went wrong. Please try again.</p>
              </motion.div>
            )}
          </form>
        </motion.div>
      </div>
    </section>
  );
}
