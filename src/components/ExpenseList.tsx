import { format } from 'date-fns';
import { Trash2, TrendingUp, TrendingDown } from 'lucide-react';
import { Expense, CATEGORIES } from '@/types/expense';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ExpenseListProps {
  expenses: Expense[];
  onDelete: (id: string) => void;
}

export const ExpenseList = ({ expenses, onDelete }: ExpenseListProps) => {
  if (expenses.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <span className="text-4xl block mb-3">📝</span>
        <p>No transactions yet</p>
        <p className="text-sm">Add your first expense above!</p>
      </div>
    );
  }

  // Group expenses by date
  const groupedExpenses = expenses.reduce((groups, expense) => {
    const dateKey = format(new Date(expense.date), 'yyyy-MM-dd');
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(expense);
    return groups;
  }, {} as Record<string, Expense[]>);

  const sortedDates = Object.keys(groupedExpenses).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <div className="space-y-6">
      {sortedDates.map((dateKey, groupIndex) => {
        const dateExpenses = groupedExpenses[dateKey];
        const displayDate = format(new Date(dateKey), 'EEEE, MMM d');
        const dayTotal = dateExpenses
          .filter(e => !e.isIncome)
          .reduce((sum, e) => sum + e.amount, 0);
        
        return (
          <div key={dateKey} className="animate-fade-in" style={{ animationDelay: `${groupIndex * 100}ms` }}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-muted-foreground">{displayDate}</h3>
              <span className="text-sm text-muted-foreground">
                -${dayTotal.toFixed(2)}
              </span>
            </div>
            
            <div className="space-y-2">
              {dateExpenses.map((expense, index) => {
                const category = CATEGORIES[expense.category];
                
                return (
                  <div
                    key={expense.id}
                    className={cn(
                      "group flex items-center gap-4 p-4 rounded-xl glass glass-hover",
                      "animate-slide-in-right"
                    )}
                    style={{ animationDelay: `${(groupIndex * 100) + (index * 50)}ms` }}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center text-lg",
                      category.bgClass
                    )}>
                      {category.icon}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{expense.description}</p>
                      <p className="text-sm text-muted-foreground">
                        {category.name}
                        {expense.merchant && ` • ${expense.merchant}`}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className={cn(
                          "font-semibold flex items-center gap-1",
                          expense.isIncome ? "text-category-income" : ""
                        )}>
                          {expense.isIncome ? (
                            <>
                              <TrendingUp className="w-4 h-4" />
                              +${expense.amount.toFixed(2)}
                            </>
                          ) : (
                            <>
                              <TrendingDown className="w-4 h-4 text-muted-foreground" />
                              ${expense.amount.toFixed(2)}
                            </>
                          )}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(expense.date), 'h:mm a')}
                        </p>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="icon"
                        className="opacity-0 group-hover:opacity-100 transition-opacity h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={() => onDelete(expense.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
