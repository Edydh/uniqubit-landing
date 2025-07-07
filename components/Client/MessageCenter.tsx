'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Message, User, MessageWithSender } from '../../lib/types';

interface MessageCenterProps {
  messages: MessageWithSender[];
  currentUser: User;
  onSendMessage: (content: string) => void;
  className?: string;
}

export default function MessageCenter({ messages, currentUser, onSendMessage, className = '' }: MessageCenterProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      await onSendMessage(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.abs(now.getTime() - date.getTime()) / 36e5;

    if (diffInHours < 24) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className={`bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Message Center</h3>
            <p className="text-gray-400 text-sm">Communicate with your project team</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm">Online</span>
          </div>
        </div>
      </div>

      {/* Messages List */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No messages yet. Start a conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUser.id;
            const isAdmin = message.sender?.role === 'admin';

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl ${
                    isCurrentUser
                      ? 'bg-gradient-to-r from-neon to-purple-400 text-black'
                      : isAdmin
                      ? 'bg-blue-500/10 border border-blue-500/20 text-white'
                      : 'bg-white/5 border border-white/10 text-white'
                  }`}>
                    {/* Sender Info */}
                    {!isCurrentUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isAdmin ? 'bg-blue-500' : 'bg-gray-500'
                        }`}>
                          {isAdmin ? '🛡️' : '👤'}
                        </div>
                        <span className="text-sm font-medium">
                          {isAdmin ? 'uniQubit Team' : 'Project Team'}
                        </span>
                        {isAdmin && (
                          <span className="px-2 py-1 bg-blue-500/20 text-blue-400 text-xs rounded-full">
                            Admin
                          </span>
                        )}
                      </div>
                    )}

                    {/* Message Content */}
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>

                    {/* Timestamp */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className={`text-xs ${
                        isCurrentUser ? 'text-black/70' : 'text-gray-400'
                      }`}>
                        {formatDate(message.created_at)}
                      </span>
                      {isCurrentUser && (
                        <span className="text-xs text-black/70">
                          Sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Avatar */}
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  isCurrentUser 
                    ? 'bg-gradient-to-r from-purple-400 to-pink-400 order-1 ml-2' 
                    : isAdmin
                    ? 'bg-blue-500 order-2 mr-2'
                    : 'bg-gray-500 order-2 mr-2'
                }`}>
                  {isCurrentUser 
                    ? currentUser.full_name?.[0] || currentUser.email[0].toUpperCase()
                    : isAdmin 
                    ? '🛡️'
                    : '👤'
                  }
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-end space-x-4">
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon/50 transition-all duration-300 resize-none"
              rows={2}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
            />
            <p className="text-gray-500 text-xs mt-1">
              Press Enter to send, Shift+Enter for new line
            </p>
          </div>
          <motion.button
            onClick={handleSendMessage}
            disabled={!newMessage.trim() || isLoading}
            className="px-6 py-3 bg-gradient-to-r from-neon to-purple-400 text-black font-semibold rounded-lg hover:shadow-neon transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black animate-spin rounded-full" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </motion.button>
        </div>
      </div>
    </div>
  );
}
