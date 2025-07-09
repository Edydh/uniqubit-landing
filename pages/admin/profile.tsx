'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import AdminLayout from '../../components/Admin/AdminLayout';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';
import type { User } from '../../lib/types';
import * as gtag from '../../lib/analytics';

const profileSchema = z.object({
  full_name: z.string().min(2, 'Full name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  current_password: z.string().optional(),
  new_password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  confirm_password: z.string().optional(),
}).refine((data) => {
  if (data.new_password || data.confirm_password) {
    return data.new_password === data.confirm_password;
  }
  return true;
}, {
  message: "Passwords don't match",
  path: ["confirm_password"],
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function AdminProfile() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPasswordFields, setShowPasswordFields] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const result = await getCurrentUser();
        if (result.user && result.user.role === 'admin') {
          setUser(result.user);
          // Pre-populate form
          reset({
            full_name: result.user.full_name || '',
            email: result.user.email || '',
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
  }, [router, reset]);

  const onSubmit = async (data: ProfileFormData) => {
    if (!user) return;

    setIsUpdating(true);
    setMessage(null);

    try {
      // Update profile information
      const updates: any = {
        full_name: data.full_name,
        updated_at: new Date().toISOString(),
      };

      // Update in the users table
      const { error: profileError } = await supabase
        .from('users')
        .update(updates)
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Update password if provided
      if (data.new_password && data.current_password) {
        const { error: passwordError } = await supabase.auth.updateUser({
          password: data.new_password,
        });

        if (passwordError) throw passwordError;
      }

      // Update email if changed
      if (data.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: data.email,
        });

        if (emailError) throw emailError;
      }

      // Track profile update
      gtag.event({
        action: 'profile_update',
        category: 'admin',
        label: 'admin_profile_updated',
      });

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      
      // Refresh user data
      const result = await getCurrentUser();
      if (result.user) {
        setUser(result.user);
      }

      // Reset password fields
      if (data.new_password) {
        setShowPasswordFields(false);
        reset({
          ...data,
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      }

    } catch (error: any) {
      console.error('Error updating profile:', error);
      setMessage({ 
        type: 'error', 
        text: error.message || 'Failed to update profile' 
      });
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <AdminLayout currentUser={null}>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon mx-auto mb-4"></div>
            <p className="text-gray-400">Loading profile...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentUser={user}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white">Admin Profile</h1>
            <p className="text-gray-400 mt-1">Manage your account settings and preferences</p>
          </div>
        </div>

        {/* Profile Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Profile Information</h2>
            <p className="text-gray-400">Update your personal information and account settings.</p>
          </div>

          {message && (
            <div className={`mb-6 p-4 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/10 border border-green-500/20 text-green-400' 
                : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              {message.text}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Full Name
              </label>
              <input
                type="text"
                {...register('full_name')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                placeholder="Your full name"
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-400">{errors.full_name.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <input
                type="email"
                {...register('email')}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                placeholder="your@email.com"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-400">{errors.email.message}</p>
              )}
            </div>

            {/* Change Password Toggle */}
            <div className="pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={() => setShowPasswordFields(!showPasswordFields)}
                className="text-neon hover:text-neon/80 transition-colors text-sm font-medium"
              >
                {showPasswordFields ? 'Cancel Password Change' : 'Change Password'}
              </button>
            </div>

            {/* Password Fields */}
            {showPasswordFields && (
              <div className="space-y-4 pt-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    {...register('current_password')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                    placeholder="Enter current password"
                  />
                  {errors.current_password && (
                    <p className="mt-1 text-sm text-red-400">{errors.current_password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    {...register('new_password')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                    placeholder="Enter new password"
                  />
                  {errors.new_password && (
                    <p className="mt-1 text-sm text-red-400">{errors.new_password.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    {...register('confirm_password')}
                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                  {errors.confirm_password && (
                    <p className="mt-1 text-sm text-red-400">{errors.confirm_password.message}</p>
                  )}
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-6">
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

        {/* Account Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass p-8"
        >
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-white mb-2">Account Information</h2>
            <p className="text-gray-400">View your account details and status.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-400 mb-1">Account Type</p>
              <p className="text-white font-medium capitalize">{user?.role || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Member Since</p>
              <p className="text-white font-medium">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Last Updated</p>
              <p className="text-white font-medium">
                {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'N/A'}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Account Status</p>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                Active
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  );
}
