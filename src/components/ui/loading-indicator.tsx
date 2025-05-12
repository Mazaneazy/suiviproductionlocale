
import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingIndicatorProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'light' | 'dark';
  className?: string;
  label?: string;
}

const LoadingIndicator = ({ 
  size = 'md', 
  color = 'primary', 
  className,
  label = 'Chargement en cours'
}: LoadingIndicatorProps) => {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-6 w-6 border-2',
    lg: 'h-8 w-8 border-3'
  };

  const colorClasses = {
    primary: 'border-certif-blue border-t-certif-blue/20',
    secondary: 'border-gray-600 border-t-gray-300',
    light: 'border-white border-t-white/20',
    dark: 'border-gray-800 border-t-gray-300'
  };

  return (
    <div className="flex items-center gap-2">
      <div 
        className={cn(
          "animate-spin rounded-full",
          sizeClasses[size],
          colorClasses[color],
          className
        )}
        aria-hidden="true"
      />
      {label && (
        <span className="sr-only">{label}</span>
      )}
    </div>
  );
};

export default LoadingIndicator;
