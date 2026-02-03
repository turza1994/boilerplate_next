import { HTMLAttributes, forwardRef } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className = '', children, ...props }, ref) => {
    const baseStyles = 'bg-white overflow-hidden shadow rounded-lg';
    const combinedClasses = `${baseStyles} ${className}`;

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    const baseStyles = 'px-4 py-5 sm:px-6 border-b border-gray-200';
    const combinedClasses = `${baseStyles} ${className}`;

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

CardHeader.displayName = 'CardHeader';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className = '', children, ...props }, ref) => {
    const baseStyles = 'px-4 py-5 sm:p-6';
    const combinedClasses = `${baseStyles} ${className}`;

    return (
      <div ref={ref} className={combinedClasses} {...props}>
        {children}
      </div>
    );
  }
);

CardContent.displayName = 'CardContent';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className = '', children, ...props }, ref) => {
    const baseStyles = 'text-lg font-medium text-gray-900';
    const combinedClasses = `${baseStyles} ${className}`;

    return (
      <h3 ref={ref} className={combinedClasses} {...props}>
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

export { Card, CardHeader, CardContent, CardTitle };