
import React from 'react';
import { cn } from '@/lib/utils';

interface SpinnerProps {
  className?: string;
  variant?: 'default' | 'small' | 'large';
}

export const Spinner: React.FC<SpinnerProps> = ({
  className,
  variant = 'default',
}) => {
  const sizeClasses = {
    small: 'h-4 w-4 border-2',
    default: 'h-8 w-8 border-3',
    large: 'h-12 w-12 border-4',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-solid border-current border-r-transparent',
        'text-certif-blue',
        sizeClasses[variant],
        className
      )}
    />
  );
};
