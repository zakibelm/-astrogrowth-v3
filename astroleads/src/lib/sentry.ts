
import * as Sentry from "@sentry/react";
import { BrowserTracing } from "@sentry/tracing";

export function initSentry() {
    if (import.meta.env.PROD) {
        Sentry.init({
            dsn: import.meta.env.VITE_SENTRY_DSN,
            integrations: [
                new BrowserTracing(),
                new Sentry.Replay({
                    maskAllText: false,
                    blockAllMedia: false,
                }),
            ],

            // Performance Monitoring
            tracesSampleRate: 1.0,

            // Session Replay
            replaysSessionSampleRate: 0.1,
            replaysOnErrorSampleRate: 1.0,

            // Environment
            environment: import.meta.env.MODE,
            release: import.meta.env.VITE_APP_VERSION,

            // User context - optional
            beforeSend(event) {
                // Filter sensitive data here if needed
                return event;
            },
        });
    }
}
