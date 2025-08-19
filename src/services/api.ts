import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { APIError } from '@/types';
import { cacheManager } from './cache';
import { rateLimiter } from './rateLimit';
import { apiConfig, appConfig } from './config';

// Custom error class for API errors
export class APIException extends Error {
  constructor(
    public message: string,
    public status?: number,
    public code?: string,
    public originalError?: any
  ) {
    super(message);
    this.name = 'APIException';
  }

  toAPIError(): APIError {
    return {
      message: this.message,
      status: this.status,
      code: this.code,
    };
  }
}

// Base API client class
class BaseAPIClient {
  protected client: AxiosInstance;
  protected serviceName: string;

  constructor(baseURL: string, serviceName: string, defaultParams: Record<string, any> = {}) {
    this.serviceName = serviceName;
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      params: defaultParams,
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for rate limiting
    this.client.interceptors.request.use(
      (config) => {
        // Check rate limit
        if (!rateLimiter.isAllowed(this.serviceName)) {
          const resetTime = rateLimiter.getTimeUntilReset(this.serviceName);
          throw new APIException(
            `Rate limit exceeded. Try again in ${Math.ceil(resetTime / 1000)} seconds.`,
            429,
            'RATE_LIMIT_EXCEEDED'
          );
        }

        if (appConfig.isDev) {
          console.log(`[${this.serviceName}] ${config.method?.toUpperCase()} ${config.url}`);
        }

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          const message = data?.status_message || data?.Error || error.message;
          
          throw new APIException(
            message,
            status,
            data?.status_code?.toString() || 'API_ERROR',
            error
          );
        } else if (error.request) {
          // Network error
          throw new APIException(
            'Network error. Please check your connection.',
            0,
            'NETWORK_ERROR',
            error
          );
        } else {
          // Other error
          throw new APIException(
            error.message || 'An unexpected error occurred',
            0,
            'UNKNOWN_ERROR',
            error
          );
        }
      }
    );
  }

  // Generic GET method with caching
  protected async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
    useCache: boolean = true
  ): Promise<T> {
    const cacheKey = `${this.serviceName}:${endpoint}`;
    
    // Check cache first
    if (useCache) {
      const cachedData = cacheManager.get<T>(cacheKey, params);
      if (cachedData) {
        if (appConfig.isDev) {
          console.log(`[${this.serviceName}] Cache hit for ${endpoint}`);
        }
        return cachedData;
      }
    }

    try {
      const response: AxiosResponse<T> = await this.client.get(endpoint, {
        ...config,
        params: { ...config?.params, ...params },
      });

      // Cache successful responses
      if (useCache && response.status === 200) {
        cacheManager.set(cacheKey, response.data, params);
      }

      return response.data;
    } catch (error) {
      if (error instanceof APIException) {
        throw error;
      }
      throw new APIException(
        'Failed to fetch data',
        0,
        'FETCH_ERROR',
        error
      );
    }
  }

  // Generic POST method
  protected async post<T>(
    endpoint: string,
    data?: any,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response: AxiosResponse<T> = await this.client.post(endpoint, data, config);
      return response.data;
    } catch (error) {
      if (error instanceof APIException) {
        throw error;
      }
      throw new APIException(
        'Failed to post data',
        0,
        'POST_ERROR',
        error
      );
    }
  }

  // Get rate limit status
  getRateLimitStatus() {
    return rateLimiter.getStatus(this.serviceName);
  }

  // Clear cache for this service
  clearCache(): void {
    // This would need to be implemented in cache manager
    // For now, we'll clear all cache
    cacheManager.clear();
  }
}

// TMDB API Client
export class TMDBClient extends BaseAPIClient {
  constructor() {
    super(
      apiConfig.tmdb.baseUrl,
      'tmdb',
      { api_key: apiConfig.tmdb.apiKey }
    );
  }

  // Override to handle TMDB-specific error responses
  protected async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
    useCache: boolean = true
  ): Promise<T> {
    try {
      return await super.get<T>(endpoint, params, config, useCache);
    } catch (error) {
      if (error instanceof APIException) {
        // Handle TMDB-specific errors
        if (error.status === 401) {
          throw new APIException(
            'Invalid TMDB API key. Please check your configuration.',
            401,
            'INVALID_API_KEY'
          );
        } else if (error.status === 404) {
          throw new APIException(
            'The requested resource was not found.',
            404,
            'NOT_FOUND'
          );
        }
      }
      throw error;
    }
  }
}

// OMDB API Client
export class OMDBClient extends BaseAPIClient {
  constructor() {
    super(
      apiConfig.omdb.baseUrl,
      'omdb',
      { apikey: apiConfig.omdb.apiKey }
    );
  }

  // Override to handle OMDB-specific error responses
  protected async get<T>(
    endpoint: string,
    params?: Record<string, any>,
    config?: AxiosRequestConfig,
    useCache: boolean = true
  ): Promise<T> {
    try {
      const response = await super.get<T>(endpoint, params, config, useCache);
      
      // OMDB returns errors in the response body
      if (typeof response === 'object' && response !== null && 'Response' in response) {
        const omdbResponse = response as any;
        if (omdbResponse.Response === 'False') {
          throw new APIException(
            omdbResponse.Error || 'OMDB API error',
            400,
            'OMDB_ERROR'
          );
        }
      }
      
      return response;
    } catch (error) {
      if (error instanceof APIException) {
        // Handle OMDB-specific errors
        if (error.status === 401) {
          throw new APIException(
            'Invalid OMDB API key. Please check your configuration.',
            401,
            'INVALID_API_KEY'
          );
        }
      }
      throw error;
    }
  }
}

// Create singleton instances
export const tmdbClient = new TMDBClient();
export const omdbClient = new OMDBClient();

// Export base client for testing (APIException is already exported above)
export { BaseAPIClient };
