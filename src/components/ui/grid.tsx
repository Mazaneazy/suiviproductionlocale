
import React from 'react';
import { cn } from '@/lib/utils';

interface GridProps {
  children: React.ReactNode;
  cols?: number | { xs?: number; sm?: number; md?: number; lg?: number; xl?: number };
  gap?: number;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  children,
  cols = 1,
  gap = 4,
  className,
}) => {
  // Générer les classes pour les colonnes
  const getColsClass = () => {
    if (typeof cols === 'number') {
      return `grid-cols-${cols}`;
    }

    const breakpoints = ['xs', 'sm', 'md', 'lg', 'xl'];
    const classes = breakpoints
      .filter((bp) => cols[bp as keyof typeof cols])
      .map((bp) => {
        const prefix = bp === 'xs' ? '' : `${bp}:`;
        return `${prefix}grid-cols-${cols[bp as keyof typeof cols]}`;
      });

    return classes.join(' ');
  };

  // Générer la classe pour l'espace entre les éléments
  const gapClass = `gap-${gap}`;

  return (
    <div className={cn('grid', getColsClass(), gapClass, className)}>
      {children}
    </div>
  );
};
