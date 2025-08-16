import { CacheItem, CacheConfig } from '@/types';
import { appConfig } from './config';

class CacheManager {
  private cache = new Map<string, CacheItem<any>>();
  private config: CacheConfig;

  constructor(config: CacheConfig = appConfig.cache) {
    this.config = config;
  }

  // Generate cache key from URL and params
  private generateKey(url: string, params?: Record<string, any>): string {
    const paramString = params ? JSON.stringify(params) : '';
    return `${url}${paramString}`;
  }

  // Check if cache item is expired
  private isExpired(item: CacheItem<any>): boolean {
    return Date.now() > item.expiresAt;
  }

  // Clean up expired items
  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  // Ensure cache doesn't exceed max size
  private enforceMaxSize(): void {
    if (this.cache.size > this.config.maxSize) {
      // Remove oldest items first
      const entries = Array.from(this.cache.entries());
      entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
      
      const itemsToRemove = this.cache.size - this.config.maxSize;
      for (let i = 0; i < itemsToRemove; i++) {
        this.cache.delete(entries[i][0]);
      }
    }
  }

  // Get item from cache
  get<T>(url: string, params?: Record<string, any>): T | null {
    const key = this.generateKey(url, params);
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  // Set item in cache
  set<T>(url: string, data: T, params?: Record<string, any>): void {
    const key = this.generateKey(url, params);
    const now = Date.now();
    
    const item: CacheItem<T> = {
      data,
      timestamp: now,
      expiresAt: now + this.config.duration,
    };

    this.cache.set(key, item);
    
    // Cleanup and enforce size limits
    this.cleanup();
    this.enforceMaxSize();
  }

  // Check if item exists and is not expired
  has(url: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(url, params);
    const item = this.cache.get(key);
    
    if (!item) {
      return false;
    }

    if (this.isExpired(item)) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  // Clear specific cache entry
  delete(url: string, params?: Record<string, any>): boolean {
    const key = this.generateKey(url, params);
    return this.cache.delete(key);
  }

  // Clear all cache
  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    memoryUsage: number;
  } {
    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: 0, // Would need to track hits/misses for this
      memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length,
    };
  }

  // Update cache configuration
  updateConfig(newConfig: Partial<CacheConfig>): void {
    this.config = { ...this.config, ...newConfig };
    this.enforceMaxSize();
  }
}

// Create singleton instance
export const cacheManager = new CacheManager();

// Export class for testing
export { CacheManager };
