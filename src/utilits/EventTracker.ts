import { type AdEvent, sendAdEvents, sendAdEventsBeacon } from '../data/Api/api';

class EventTracker {
  private cache: AdEvent[] = [];
  private maxCacheSize = 20;
  private flushInterval = 5000;
  private timer: ReturnType<typeof setInterval> | null = null; // исправлено для браузера
  private enabled = false;

  start() {
    if (this.enabled) return;
    this.enabled = true;
    this.timer = setInterval(() => this.flush(), this.flushInterval);
    window.addEventListener('beforeunload', () => this.flush(true));
  }

  stop() {
    if (!this.enabled) return;
    this.enabled = false;
    if (this.timer) clearInterval(this.timer);
    this.flush(true);
  }

  track(event: AdEvent) {
    if (!this.enabled) return;
    this.cache.push({ ...event, timestamp: new Date().toISOString() });
    if (this.cache.length >= this.maxCacheSize) this.flush();
  }

  private flush(forceBeacon = false) {
    if (!this.cache.length) return;
    if (forceBeacon) sendAdEventsBeacon(this.cache);
    else sendAdEvents(this.cache);
    this.cache = [];
  }
}

export const tracker = new EventTracker();
export type { AdEvent };
