import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  subValue?: string;
  icon: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  className?: string;
  delay?: number;
}

export const StatCard = ({ label, value, subValue, icon, trend, className, delay = 0 }: StatCardProps) => {
  return (
    <div 
      className={cn(
        "p-5 rounded-2xl glass animate-scale-in",
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-muted-foreground text-sm">{label}</span>
        <div className="text-primary">{icon}</div>
      </div>
      <p className={cn(
        "text-2xl font-bold",
        trend === 'up' && "text-category-income",
        trend === 'down' && "text-destructive"
      )}>
        {value}
      </p>
      {subValue && (
        <p className="text-sm text-muted-foreground mt-1">{subValue}</p>
      )}
    </div>
  );
};
