import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import { initSentry } from '@/lib/sentry';
import { initPostHog, initMixpanel } from '@/lib/analytics';
import { initPerformanceMonitoring } from '@/lib/performance';

// Initialize Monitoring & Observability
// initSentry(); // Temporarily disabled - Sentry.Replay import issue
initPostHog();
initMixpanel();
initPerformanceMonitoring();

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
