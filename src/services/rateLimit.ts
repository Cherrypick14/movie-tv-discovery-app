import { RateLimitConfig, RateLimitState } from '@/types';
import { appConfig } from './config';

class RateLimiter {
  private state: Map<string, RateLimitState> = new Map();

  constructor(private config: Record<string, RateLimitConfig> = appConfig.rateLimit) {}

  // Check if request is allowed
  isAllowed(service: string): boolean {
    const config = this.config[service];
    if (!config) {
      return true; // No rate limit configured
    }

    const now = Date.now();
    const state = this.state.get(service);

    if (!state) {
      // First request for this service
      this.state.set(service, {
        requests: 1,
        windowStart: now,
      });
      return true;
    }

    // Check if we're in a new window
    if (now - state.windowStart >= config.window) {
      // Reset for new window
      this.state.set(service, {
        requests: 1,
        windowStart: now,
      });
      return true;
    }

    // Check if we've exceeded the limit
    if (state.requests >= config.requests) {
      return false;
    }

    // Increment request count
    state.requests++;
    return true;
  }

  // Get time until next request is allowed
  getTimeUntilReset(service: string): number {
    const config = this.config[service];
    const state = this.state.get(service);

    if (!config || !state) {
      return 0;
    }

    const windowEnd = state.windowStart + config.window;
    const now = Date.now();

    return Math.max(0, windowEnd - now);
  }

  // Get remaining requests in current window
  getRemainingRequests(service: string): number {
    const config = this.config[service];
    const state = this.state.get(service);

    if (!config) {
      return Infinity;
    }

    if (!state) {
      return config.requests;
    }

    const now = Date.now();
    
    // If we're in a new window, return full limit
    if (now - state.windowStart >= config.window) {
      return config.requests;
    }

    return Math.max(0, config.requests - state.requests);
  }

  // Reset rate limit for a service
  reset(service: string): void {
    this.state.delete(service);
  }

  // Reset all rate limits
  resetAll(): void {
    this.state.clear();
  }

  // Update rate limit configuration
  updateConfig(service: string, config: RateLimitConfig): void {
    this.config[service] = config;
  }

  // Get rate limit status
  getStatus(service: string): {
    allowed: boolean;
    remaining: number;
    resetTime: number;
    limit: number;
    window: number;
  } {
    const config = this.config[service];
    
    if (!config) {
      return {
        allowed: true,
        remaining: Infinity,
        resetTime: 0,
        limit: Infinity,
        window: 0,
      };
    }

    return {
      allowed: this.isAllowed(service),
      remaining: this.getRemainingRequests(service),
      resetTime: this.getTimeUntilReset(service),
      limit: config.requests,
      window: config.window,
    };
  }
}

// Create singleton instance
export const rateLimiter = new RateLimiter();

// Export class for testing
export { RateLimiter };
