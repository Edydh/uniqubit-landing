'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import type { MessageWithSender, ProjectMessage, User } from '../../lib/types';

interface ProjectCommentsProps {
  messages: MessageWithSender[] | ProjectMessage[];
  currentUser: User | null;
  onSendMessage: (content: string) => void;
  projectId: string;
  isAdmin: boolean;
}

export default function ProjectComments({ 
  messages, 
  currentUser, 
  onSendMessage, 
  projectId, 
  isAdmin 
}: ProjectCommentsProps) {
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentUser) return;

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

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor(diffInHours * 60);
      return diffInMinutes <= 1 ? 'Just now' : `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  };

  const getMessageAlignment = (senderId: string) => {
    return senderId === currentUser?.id ? 'justify-end' : 'justify-start';
  };

  const getMessageStyle = (senderId: string, senderRole: string) => {
    if (senderId === currentUser?.id) {
      return 'bg-gradient-to-r from-neon to-purple-400 text-black ml-12';
    } else if (senderRole === 'admin') {
      return 'bg-blue-500/10 border border-blue-500/20 text-white mr-12';
    } else {
      return 'bg-white/5 border border-white/10 text-white mr-12';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-glass backdrop-blur-xl rounded-2xl border border-white/10 shadow-glass overflow-hidden"
    >
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white mb-2">Project Communication</h3>
            <p className="text-gray-400 text-sm">
              Stay updated with real-time project discussions
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-400 text-sm">Online</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="h-96 overflow-y-auto p-6 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <p className="text-gray-400 text-sm">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isCurrentUser = message.sender_id === currentUser?.id;
            const isAdmin = message.sender?.role === 'admin';

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`flex ${getMessageAlignment(message.sender_id)}`}
              >
                <div className={`max-w-xs lg:max-w-md ${isCurrentUser ? 'order-2' : 'order-1'}`}>
                  {/* Message Bubble */}
                  <div className={`p-4 rounded-2xl ${getMessageStyle(message.sender_id, message.sender?.role || '')}`}>
                    {/* Sender Info */}
                    {!isCurrentUser && (
                      <div className="flex items-center space-x-2 mb-2">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          isAdmin ? 'bg-blue-500 text-white' : 'bg-gray-600 text-white'
                        }`}>
                          {(message.sender?.full_name || message.sender?.email || 'U')[0].toUpperCase()}
                        </div>
                        <span className="text-xs opacity-75">
                          {message.sender?.full_name || 'Team Member'}
                          {isAdmin && <span className="ml-1 text-blue-400">• Admin</span>}
                        </span>
                      </div>
                    )}

                    {/* Message Content */}
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {message.content}
                    </p>

                    {/* Attachments (placeholder for future enhancement) */}
                    {message.attachments && message.attachments.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-current/20">
                        <div className="flex items-center space-x-1 text-xs opacity-75">
                          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                          </svg>
                          <span>{message.attachments.length} attachment(s)</span>
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div className={`text-xs opacity-60 mt-2 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                      {formatDate(message.created_at)}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}

        {/* Loading indicator for new message */}
        {isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-end"
          >
            <div className="bg-white/5 rounded-2xl p-4 ml-12">
              <div className="flex items-center space-x-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-neon rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                  <div className="w-2 h-2 bg-neon rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                </div>
                <span className="text-gray-400 text-xs">Sending...</span>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Message Input */}
      <div className="p-6 border-t border-white/10">
        <div className="flex items-end space-x-3">
          {/* User Avatar */}
          <div className="w-8 h-8 bg-gradient-to-r from-neon to-purple-400 rounded-full flex items-center justify-center text-black text-sm font-bold">
            {(currentUser?.full_name || currentUser?.email || 'U')[0].toUpperCase()}
          </div>

          {/* Message Input */}
          <div className="flex-1">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder={isAdmin ? "Send an update to your client..." : "Ask a question or share feedback..."}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-neon/50 focus:border-neon/50 transition-all duration-300"
              rows={2}
              disabled={isLoading}
            />
            <div className="flex items-center justify-between mt-2">
              <span className="text-xs text-gray-400">
                Press Enter to send, Shift+Enter for new line
              </span>
              <div className="flex items-center space-x-2">
                {/* Attachment button (placeholder for future enhancement) */}
                <button
                  className="p-2 text-gray-400 hover:text-white transition-colors"
                  title="Attach file (coming soon)"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                {/* Send button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || isLoading}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 ${
                    newMessage.trim() && !isLoading
                      ? 'bg-gradient-to-r from-neon to-purple-400 text-black hover:shadow-neon'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? 'Sending...' : 'Send'}
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
