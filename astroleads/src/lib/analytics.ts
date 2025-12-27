
import posthog from 'posthog-js';
import mixpanel from 'mixpanel-browser';

// PostHog Initialization
export function initPostHog() {
    if (import.meta.env.VITE_POSTHOG_KEY) {
        posthog.init(import.meta.env.VITE_POSTHOG_KEY, {
            api_host: 'https://app.posthog.com',
            autocapture: true,
            capture_pageview: true,
            capture_pageleave: true,
            persistence: 'localStorage'
        });
    }
}

// Mixpanel Initialization
export function initMixpanel() {
    if (import.meta.env.VITE_MIXPANEL_TOKEN) {
        mixpanel.init(import.meta.env.VITE_MIXPANEL_TOKEN, {
            debug: import.meta.env.DEV,
            track_pageview: true,
            persistence: 'localStorage',
        });
    }
}

// Unified tracking object
export const track = {
    event(name: string, properties?: Record<string, any>) {
        if (import.meta.env.VITE_POSTHOG_KEY) posthog.capture(name, properties);
        if (import.meta.env.VITE_MIXPANEL_TOKEN) mixpanel.track(name, properties);

        // Dev logs
        if (import.meta.env.DEV) {
            console.log(`📊 [Analytics] Event: ${name}`, properties);
        }
    },

    identify(userId: string, traits?: Record<string, any>) {
        if (import.meta.env.VITE_POSTHOG_KEY) posthog.identify(userId, traits);
        if (import.meta.env.VITE_MIXPANEL_TOKEN) {
            mixpanel.identify(userId);
            if (traits) mixpanel.people.set(traits);
        }
    },

    page(name: string, properties?: Record<string, any>) {
        if (import.meta.env.VITE_POSTHOG_KEY) posthog.capture('$pageview', { ...properties, page: name });
        if (import.meta.env.VITE_MIXPANEL_TOKEN) mixpanel.track_pageview({ page: name, ...properties as any });
    }
};
