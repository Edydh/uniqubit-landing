import * as Sentry from '@sentry/nextjs';
import React from 'react';

// Custom error tracking utilities for uniQubit platform
export class UniQubitSentry {
  
  // Track business-critical errors
  static captureBusinessError(error: Error, context: {
    action: string;
    userId?: string;
    leadId?: string;
    projectId?: string;
    email?: string;
  }) {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'business_critical');
      scope.setTag('business_action', context.action);
      
      if (context.userId) {
        scope.setUser({ id: context.userId });
      }
      
      if (context.leadId) {
        scope.setContext('lead', { id: context.leadId });
      }
      
      if (context.projectId) {
        scope.setContext('project', { id: context.projectId });
      }
      
      if (context.email) {
        scope.setContext('email', { recipient: context.email });
      }
      
      Sentry.captureException(error);
    });
  }
  
  // Track AI service errors specifically
  static captureAIError(error: Error, context: {
    service: 'openai' | 'lead_analysis' | 'contact_ai';
    prompt?: string;
    leadData?: any;
  }) {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'ai_service');
      scope.setTag('ai_service', context.service);
      
      if (context.prompt) {
        scope.setContext('ai_prompt', { 
          prompt: context.prompt.substring(0, 200) // Limit prompt length for privacy
        });
      }
      
      if (context.leadData) {
        scope.setContext('lead_data', {
          hasEmail: !!context.leadData.email,
          hasCompany: !!context.leadData.company,
          messageLength: context.leadData.message?.length || 0
        });
      }
      
      Sentry.captureException(error);
    });
  }
  
  // Track email delivery issues
  static captureEmailError(error: Error, context: {
    service: 'resend' | 'supabase';
    emailType: 'welcome' | 'notification' | 'auth' | 'project_update';
    recipient: string;
  }) {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'email_delivery');
      scope.setTag('email_service', context.service);
      scope.setTag('email_type', context.emailType);
      
      scope.setContext('email_context', {
        recipient: context.recipient,
        service: context.service,
        type: context.emailType
      });
      
      Sentry.captureException(error);
    });
  }
  
  // Track database errors
  static captureDatabaseError(error: Error, context: {
    operation: 'create' | 'read' | 'update' | 'delete';
    table: string;
    userId?: string;
  }) {
    Sentry.withScope((scope) => {
      scope.setTag('error_type', 'database');
      scope.setTag('db_operation', context.operation);
      scope.setTag('db_table', context.table);
      
      if (context.userId) {
        scope.setUser({ id: context.userId });
      }
      
      scope.setContext('database', {
        operation: context.operation,
        table: context.table
      });
      
      Sentry.captureException(error);
    });
  }
  
  // Track user journey events
  static captureUserJourney(event: string, context: {
    userId?: string;
    userRole?: 'admin' | 'client';
    page: string;
    action?: string;
  }) {
    Sentry.addBreadcrumb({
      message: event,
      category: 'user_journey',
      data: {
        page: context.page,
        action: context.action,
        userRole: context.userRole
      },
      level: 'info'
    });
    
    if (context.userId) {
      Sentry.setUser({ id: context.userId, role: context.userRole });
    }
  }
  
  // Track performance metrics for business operations
  static trackBusinessMetric(metric: string, value: number, context: {
    operation: string;
    success: boolean;
    duration?: number;
  }) {
    Sentry.withScope((scope) => {
      scope.setTag('metric_type', 'business');
      scope.setTag('operation', context.operation);
      scope.setTag('success', context.success.toString());
      
      scope.setContext('performance', {
        metric,
        value,
        duration: context.duration,
        operation: context.operation
      });
      
      Sentry.captureMessage(`Business Metric: ${metric}`, 'info');
    });
  }
}

// Wrapper for API routes to automatically capture errors
export function withSentryApiRoute<T extends (...args: any[]) => any>(
  handler: T,
  routeName: string
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (error) {
      Sentry.withScope((scope) => {
        scope.setTag('error_type', 'api_route');
        scope.setTag('route_name', routeName);
        scope.setContext('api_route', { name: routeName });
        
        Sentry.captureException(error);
      });
      throw error;
    }
  }) as T;
}

// React component error boundary with Sentry integration
// Implementation moved to lib/sentry.tsx to support JSX. Import from 'lib/sentry' as usual.
// This is a stub to avoid import errors in non-TSX contexts.
export {};
