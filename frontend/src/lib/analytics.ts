/**
 * Blueprint Section 22: Product Analytics & Telemetry Client
 * Implements non-blocking, privacy-respecting client event telemetry.
 */

export interface TelemetryPayload {
  eventName: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

class AnalyticsService {
  private queue: TelemetryPayload[] = [];
  private flushTimer: any = null;
  private readonly endpoint = '/analytics/events';

  /**
   * Track an educational interaction event. Non-blocking with failsafe fallback.
   */
  track(eventName: string, properties: Record<string, any> = {}) {
    if (typeof window === 'undefined') return;

    const payload: TelemetryPayload = {
      eventName,
      properties: {
        ...properties,
        url: window.location.pathname,
        referrer: document.referrer || undefined,
        screenSize: `${window.innerWidth}x${window.innerHeight}`
      },
      userId: this.getUserId(),
      timestamp: new Date().toISOString()
    };

    this.queue.push(payload);

    // Debounce flush every 3 seconds or immediately if queue >= 5
    if (this.queue.length >= 5) {
      this.flush();
    } else if (!this.flushTimer) {
      this.flushTimer = setTimeout(() => this.flush(), 3000);
    }
  }

  private getUserId(): string {
    if (typeof window === 'undefined') return 'user_default';
    try {
      const stored = localStorage.getItem('finetube_user_id');
      if (stored) return stored;
      const newId = `u_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('finetube_user_id', newId);
      return newId;
    } catch {
      return 'user_default';
    }
  }

  private async flush() {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    if (this.queue.length === 0) return;

    const itemsToSend = [...this.queue];
    this.queue = [];

    for (const item of itemsToSend) {
      try {
        const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
        const cleanBase = base.replace(/\/+$/, '');
        fetch(`${cleanBase}${this.endpoint}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item),
          keepalive: true
        }).catch(() => {
          // Silent fallback - analytics must never degrade core UX
        });
      } catch {
        // Suppress network errors
      }
    }
  }
}

export const analytics = new AnalyticsService();
