'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/router';
import ClientLayout from '../../components/Client/ClientLayout';
import { getCurrentUser, updateUserProfile } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { User } from '../../lib/types';
import * as gtag from '../../lib/analytics';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  business_name: z.string().optional(),
  country: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ClientProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateMessage, setUpdateMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user && result.user.role === 'client') {
          setUser(result.user);
          setValue('full_name', result.user.full_name || '');
          setValue('email', result.user.email || '');
          setValue('business_name', result.user.business_name || '');
          setValue('country', result.user.country || '');
          
          // Track profile page view
          gtag.event({
            action: 'profile_view',
            category: 'engagement',
            label: 'client_profile',
          });
        } else {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router, setValue]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsUpdating(true);
    setUpdateMessage(null);

    try {
      // Update user profile in the database
      const { error } = await supabase
        .from('users')
        .update({
          full_name: data.full_name,
          email: data.email,
          business_name: data.business_name,
          country: data.country,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      // Update local user state
      setUser(prev => prev ? { 
        ...prev, 
        full_name: data.full_name, 
        email: data.email,
        business_name: data.business_name,
        country: data.country
      } : null);
      
      // Track profile update
      gtag.event({
        action: 'profile_update',
        category: 'engagement',
        label: 'client_profile_update',
      });

      setUpdateMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      console.error('Error updating profile:', error);
      setUpdateMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <ClientLayout user={null}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
              <p className="text-gray-400">Loading your profile...</p>
            </div>
          </div>
        </div>
      </ClientLayout>
    );
  }

  if (!user) {
    return (
      <ClientLayout user={null}>
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-12">
            <h2 className="text-xl font-semibold text-white mb-2">Access Denied</h2>
            <p className="text-gray-400 mb-6">You need to be logged in to view this page.</p>
          </div>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout user={user}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* Page Header */}
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Client Profile</h1>
            <p className="text-gray-400">Manage your account settings and preferences</p>
          </div>

          {/* Profile Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Profile Information</h2>
            <p className="text-gray-400 mb-6">Update your personal information and account settings.</p>

            {updateMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg mb-6 ${
                  updateMessage.type === 'success' 
                    ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                    : 'bg-red-500/10 border border-red-500/20 text-red-400'
                }`}
              >
                {updateMessage.text}
              </motion.div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Full Name */}
              <div>
                <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <input
                  {...register('full_name')}
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                  placeholder="Your full name"
                />
                {errors.full_name && (
                  <p className="mt-1 text-sm text-red-400">{errors.full_name.message}</p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
                )}
              </div>

              {/* Business Name */}
              <div>
                <label htmlFor="business_name" className="block text-sm font-medium text-gray-300 mb-2">
                  Business Name <span className="text-gray-500">(Optional)</span>
                </label>
                <input
                  {...register('business_name')}
                  type="text"
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                  placeholder="Your business or company name"
                />
                {errors.business_name && (
                  <p className="mt-1 text-sm text-red-400">{errors.business_name.message}</p>
                )}
              </div>

              {/* Country */}
              <div>
                <label htmlFor="country" className="block text-sm font-medium text-gray-300 mb-2">
                  Country <span className="text-gray-500">(Optional)</span>
                </label>
                <select
                  {...register('country')}
                  className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                >
                  <option value="" className="bg-gray-800 text-gray-300">Select your country</option>
                  <option value="US" className="bg-gray-800 text-white">United States</option>
                  <option value="CA" className="bg-gray-800 text-white">Canada</option>
                  <option value="GB" className="bg-gray-800 text-white">United Kingdom</option>
                  <option value="AU" className="bg-gray-800 text-white">Australia</option>
                  <option value="DE" className="bg-gray-800 text-white">Germany</option>
                  <option value="FR" className="bg-gray-800 text-white">France</option>
                  <option value="IT" className="bg-gray-800 text-white">Italy</option>
                  <option value="ES" className="bg-gray-800 text-white">Spain</option>
                  <option value="NL" className="bg-gray-800 text-white">Netherlands</option>
                  <option value="SE" className="bg-gray-800 text-white">Sweden</option>
                  <option value="NO" className="bg-gray-800 text-white">Norway</option>
                  <option value="DK" className="bg-gray-800 text-white">Denmark</option>
                  <option value="FI" className="bg-gray-800 text-white">Finland</option>
                  <option value="JP" className="bg-gray-800 text-white">Japan</option>
                  <option value="KR" className="bg-gray-800 text-white">South Korea</option>
                  <option value="SG" className="bg-gray-800 text-white">Singapore</option>
                  <option value="BR" className="bg-gray-800 text-white">Brazil</option>
                  <option value="MX" className="bg-gray-800 text-white">Mexico</option>
                  <option value="IN" className="bg-gray-800 text-white">India</option>
                  <option value="CN" className="bg-gray-800 text-white">China</option>
                  <option value="OTHER" className="bg-gray-800 text-white">Other</option>
                </select>
                {errors.country && (
                  <p className="mt-1 text-sm text-red-400">{errors.country.message}</p>
                )}
              </div>

              {/* Change Password Link */}
              <div>
                <button
                  type="button"
                  onClick={() => router.push('/forgot-password')}
                  className="text-neon hover:text-neon/80 transition-colors text-sm"
                >
                  Change Password
                </button>
              </div>

              {/* Update Button */}
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-6 py-3 bg-gradient-to-r from-neon to-purple-400 text-black font-semibold rounded-lg hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? 'Updating...' : 'Update Profile'}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Account Information Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Account Information</h2>
            <p className="text-gray-400 mb-6">View your account details and status.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-gray-400 text-sm mb-1">Account Type</p>
                <p className="text-white font-medium capitalize">{user.role}</p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Member Since</p>
                <p className="text-white font-medium">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Business Name</p>
                <p className="text-white font-medium">
                  {user.business_name || 'Not specified'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Country</p>
                <p className="text-white font-medium">
                  {user.country || 'Not specified'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Last Updated</p>
                <p className="text-white font-medium">
                  {user.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
                </p>
              </div>
              
              <div>
                <p className="text-gray-400 text-sm mb-1">Account Status</p>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                  Active
                </span>
              </div>
            </div>
          </motion.div>

          {/* Support Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-6"
          >
            <h2 className="text-xl font-bold text-white mb-4">Need Help?</h2>
            <p className="text-gray-400 mb-4">
              Have questions about your account or need assistance with your projects?
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => {
                  gtag.event({
                    action: 'support_contact',
                    category: 'engagement',
                    label: 'client_profile_support',
                  });
                  router.push('/#contact');
                }}
                className="w-full px-4 py-2 bg-neon/10 border border-neon/20 text-neon rounded-lg hover:bg-neon/20 transition-colors text-sm"
              >
                Contact Support
              </button>
              
              <button
                onClick={() => router.push('/client/dashboard')}
                className="w-full px-4 py-2 bg-blue-500/10 border border-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/20 transition-colors text-sm"
              >
                Back to Dashboard
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    </ClientLayout>
  );
}
