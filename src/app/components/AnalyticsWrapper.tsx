'use client';

import React from 'react';

const APP_KEY = 'A-US-7448288270';
const APTABASE_URL = 'https://us.aptabase.com/api/v1/events';

async function trackEvent(eventName: string, props?: Record<string, any>) {
  try {
    const systemInfo = {
      locale: navigator.language,
      osName: getOSName(),
      browserName: getBrowserName(),
      screenSize: `${window.screen.width}x${window.screen.height}`,
    };

    await fetch(APTABASE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Api-Key': APP_KEY,
      },
      body: JSON.stringify({
        timestamp: new Date().toISOString(),
        sessionId: getSessionId(),
        eventName,
        systemProps: systemInfo,
        props,
      }),
    });
  } catch (error) {
    // Silently fail for analytics
    console.debug('Analytics error:', error);
  }
}

// Helper functions
function getSessionId(): string {
  const key = 'aptabase_sid';
  let sid = sessionStorage.getItem(key);
  if (!sid) {
    sid = Math.random().toString(36).substring(2, 15);
    sessionStorage.setItem(key, sid);
  }
  return sid;
}

function getOSName(): string {
  const userAgent = window.navigator.userAgent;
  const platform = window.navigator.platform;
  const macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'];
  const windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'];
  const iosPlatforms = ['iPhone', 'iPad', 'iPod'];

  if (macosPlatforms.indexOf(platform) !== -1) return 'macOS';
  if (iosPlatforms.indexOf(platform) !== -1) return 'iOS';
  if (windowsPlatforms.indexOf(platform) !== -1) return 'Windows';
  if (/Android/.test(userAgent)) return 'Android';
  if (/Linux/.test(platform)) return 'Linux';

  return 'Unknown';
}

function getBrowserName(): string {
  const userAgent = navigator.userAgent;
  if (userAgent.indexOf("Chrome") > -1) return "Chrome";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident/") > -1) return "IE";
  if (userAgent.indexOf("Edge") > -1) return "Edge";
  return "Unknown";
}

export function AnalyticsWrapper({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    trackEvent('app_started');
  }, []);

  return children;
} 
