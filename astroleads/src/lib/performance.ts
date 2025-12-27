
import { onCLS, onINP, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

export function initPerformanceMonitoring() {
    // Core Web Vitals
    onCLS(sendToAnalytics);
    onINP(sendToAnalytics);
    onFCP(sendToAnalytics);
    onLCP(sendToAnalytics);
    onTTFB(sendToAnalytics);
}

function sendToAnalytics(metric: Metric) {
    const body = JSON.stringify({
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
    });

    // Example: Send to internal analytics endpoint if you have one, 
    // or log to console in dev
    if (import.meta.env.DEV) {
        console.log(`⚡ [Performance] ${metric.name}:`, metric.value);
    }

    // You could also send this to Vercel Analytics or your own backend
    // if (navigator.sendBeacon) {
    //   navigator.sendBeacon('/api/analytics', body);
    // }
}
