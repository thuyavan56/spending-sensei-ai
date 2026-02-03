import { cn } from '@/lib/utils';
import { SpendingInsight } from '@/types/expense';

interface InsightCardProps {
  insight: SpendingInsight;
  index: number;
}

export const InsightCard = ({ insight, index }: InsightCardProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-xl border animate-fade-in",
        insight.type === 'warning' && "bg-orange-500/10 border-orange-500/30",
        insight.type === 'success' && "bg-primary/10 border-primary/30",
        insight.type === 'info' && "bg-blue-500/10 border-blue-500/30"
      )}
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl">{insight.icon}</span>
        <div>
          <h4 className="font-medium">{insight.title}</h4>
          <p className="text-sm text-muted-foreground mt-1">{insight.description}</p>
        </div>
      </div>
    </div>
  );
};
