import React, { ReactNode } from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`bg-white border border-gov-border rounded-xl shadow-portal transition-all duration-200 ${
        hoverable ? 'hover:border-gov-accent hover:shadow-portal-hover hover:-translate-y-0.5' : ''
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
