// lib/analytics.ts
export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID || 'UA-144546029-1';

// https://developers.google.com/analytics/devguides/collection/gtagjs/pages
export const pageview = (url: string) => {
  if (typeof window !== 'undefined') {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: url,
    });
  }
};

// https://developers.google.com/analytics/devguides/collection/gtagjs/events
export const event = ({
  action,
  category,
  label,
  value,
}: {
  action: string;
  category: string;
  label?: string;
  value?: number;
}) => {
  if (typeof window !== 'undefined') {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Custom events for your uniQubit platform
export const trackContactForm = (email: string, name: string) => {
  event({
    action: 'contact_form_submit',
    category: 'engagement',
    label: email,
  });
};

export const trackLogin = (method: string) => {
  event({
    action: 'login',
    category: 'authentication',
    label: method,
  });
};

export const trackRegistration = (method: string) => {
  event({
    action: 'sign_up',
    category: 'authentication',
    label: method,
  });
};

export const trackProjectView = (projectId: string) => {
  event({
    action: 'project_view',
    category: 'engagement',
    label: projectId,
  });
};

export const trackLeadConversion = (leadId: string, score: number) => {
  event({
    action: 'lead_conversion',
    category: 'business',
    label: leadId,
    value: score,
  });
};
