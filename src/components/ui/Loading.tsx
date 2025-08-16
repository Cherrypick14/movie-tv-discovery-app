import React from 'react';
import { cn } from '@/utils';

export interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'spinner' | 'dots' | 'pulse';
  className?: string;
  text?: string;
}

const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  variant = 'spinner',
  className,
  text 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const renderSpinner = () => (
    <svg
      className={cn('animate-spin', sizeClasses[size], className)}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
  );

  const renderDots = () => (
    <div className={cn('flex space-x-1', className)}>
      <div className={cn('rounded-full bg-current animate-pulse', 
        size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
      )} style={{ animationDelay: '0ms' }} />
      <div className={cn('rounded-full bg-current animate-pulse',
        size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
      )} style={{ animationDelay: '150ms' }} />
      <div className={cn('rounded-full bg-current animate-pulse',
        size === 'sm' ? 'w-1 h-1' : size === 'md' ? 'w-2 h-2' : 'w-3 h-3'
      )} style={{ animationDelay: '300ms' }} />
    </div>
  );

  const renderPulse = () => (
    <div className={cn(
      'rounded-full bg-current animate-pulse',
      sizeClasses[size],
      className
    )} />
  );

  const renderLoader = () => {
    switch (variant) {
      case 'dots':
        return renderDots();
      case 'pulse':
        return renderPulse();
      default:
        return renderSpinner();
    }
  };

  if (text) {
    return (
      <div className="flex items-center space-x-2">
        {renderLoader()}
        <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
      </div>
    );
  }

  return renderLoader();
};

// Skeleton component for loading states
export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'text' | 'rectangular' | 'circular';
  width?: string | number;
  height?: string | number;
  lines?: number;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'rectangular',
  width,
  height,
  lines = 1,
  className,
  ...props
}) => {
  const baseClasses = 'skeleton';
  
  const variantClasses = {
    text: 'h-4',
    rectangular: 'h-20',
    circular: 'rounded-full w-12 h-12',
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  if (variant === 'text' && lines > 1) {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={cn(
              baseClasses,
              variantClasses[variant],
              index === lines - 1 && 'w-3/4', // Last line is shorter
              className
            )}
            style={style}
            {...props}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        baseClasses,
        variantClasses[variant],
        className
      )}
      style={style}
      {...props}
    />
  );
};

// Loading overlay component
export interface LoadingOverlayProps {
  isLoading: boolean;
  children: React.ReactNode;
  text?: string;
  className?: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({
  isLoading,
  children,
  text = 'Loading...',
  className,
}) => {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center space-y-2">
            <Loading size="lg" />
            <span className="text-sm text-gray-600 dark:text-gray-400">{text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export { Loading, Skeleton, LoadingOverlay };
