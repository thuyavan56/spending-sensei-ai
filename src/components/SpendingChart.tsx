import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { ExpenseCategory, CATEGORIES } from '@/types/expense';

interface SpendingChartProps {
  data: Record<ExpenseCategory, number>;
}

export const SpendingChart = ({ data }: SpendingChartProps) => {
  const chartData = useMemo(() => {
    return Object.entries(data)
      .filter(([, value]) => value > 0)
      .map(([category, value]) => ({
        name: CATEGORIES[category as ExpenseCategory].name,
        value,
        color: CATEGORIES[category as ExpenseCategory].color,
        icon: CATEGORIES[category as ExpenseCategory].icon,
      }))
      .sort((a, b) => b.value - a.value);
  }, [data]);

  const total = useMemo(() => chartData.reduce((sum, item) => sum + item.value, 0), [chartData]);

  if (chartData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
        <span className="text-4xl mb-2">📊</span>
        <p>No spending data yet</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row items-center gap-6">
      <div className="relative w-48 h-48">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={75}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="glass rounded-lg px-3 py-2 shadow-lg">
                      <p className="text-sm font-medium">{data.icon} {data.name}</p>
                      <p className="text-lg font-bold">${data.value.toFixed(2)}</p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-sm text-muted-foreground">Total</span>
          <span className="text-xl font-bold">${total.toFixed(0)}</span>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-2 w-full">
        {chartData.map((item, index) => (
          <div
            key={item.name}
            className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/50 transition-colors animate-fade-in"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.color }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs text-muted-foreground truncate">{item.name}</p>
              <p className="text-sm font-semibold">${item.value.toFixed(0)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
