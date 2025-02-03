'use client';

import React from 'react';
import { useAptabase } from '@aptabase/react';

export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  const { trackEvent } = useAptabase();
  
  // Track page view on component mount
  React.useEffect(() => {
    trackEvent('app_started');
  }, [trackEvent]);

  return children;
} 