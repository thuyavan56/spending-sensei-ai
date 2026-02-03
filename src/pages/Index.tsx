import { Wallet, TrendingUp, TrendingDown, Receipt, Sparkles } from 'lucide-react';
import { useExpenses } from '@/hooks/useExpenses';
import { ExpenseInput } from '@/components/ExpenseInput';
import { ExpenseList } from '@/components/ExpenseList';
import { SpendingChart } from '@/components/SpendingChart';
import { InsightCard } from '@/components/InsightCard';
import { StatCard } from '@/components/StatCard';

const Index = () => {
  const { expenses, addExpense, deleteExpense, stats, insights, isProcessing } = useExpenses();

  return (
    <div className="min-h-screen bg-background">
      {/* Gradient background effect */}
      <div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 20% 20%, hsl(162 72% 45% / 0.08), transparent 50%), radial-gradient(circle at 80% 80%, hsl(17 88% 60% / 0.05), transparent 50%)'
        }}
      />
      
      <div className="relative max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="mb-8 animate-fade-in">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-primary" />
            </div>
            <h1 className="text-2xl font-bold">
              <span className="gradient-text">Smart</span>Spend
            </h1>
          </div>
          <p className="text-muted-foreground">AI-powered expense tracking that understands you</p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard
            label="This Month"
            value={`$${stats.totalSpent.toFixed(0)}`}
            subValue={`${stats.transactionCount} transactions`}
            icon={<Receipt className="w-5 h-5" />}
            delay={0}
          />
          <StatCard
            label="Income"
            value={`$${stats.totalIncome.toFixed(0)}`}
            icon={<TrendingUp className="w-5 h-5" />}
            trend="up"
            delay={100}
          />
          <StatCard
            label="Balance"
            value={`$${stats.balance.toFixed(0)}`}
            icon={stats.balance >= 0 ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
            trend={stats.balance >= 0 ? 'up' : 'down'}
            delay={200}
          />
          <StatCard
            label="AI Insights"
            value={`${insights.length}`}
            subValue="recommendations"
            icon={<Sparkles className="w-5 h-5" />}
            delay={300}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Expense Input */}
            <section className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-primary" />
                Add Expense
              </h2>
              <ExpenseInput onSubmit={addExpense} isProcessing={isProcessing} />
            </section>

            {/* AI Insights */}
            {insights.length > 0 && (
              <section className="animate-fade-in" style={{ animationDelay: '300ms' }}>
                <h2 className="text-lg font-semibold mb-4">AI Insights</h2>
                <div className="grid gap-3">
                  {insights.map((insight, index) => (
                    <InsightCard key={index} insight={insight} index={index} />
                  ))}
                </div>
              </section>
            )}

            {/* Recent Transactions */}
            <section className="animate-fade-in" style={{ animationDelay: '400ms' }}>
              <h2 className="text-lg font-semibold mb-4">Recent Transactions</h2>
              <ExpenseList expenses={expenses.slice(0, 10)} onDelete={deleteExpense} />
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-8">
            {/* Spending Chart */}
            <section className="p-6 rounded-2xl glass animate-fade-in" style={{ animationDelay: '500ms' }}>
              <h2 className="text-lg font-semibold mb-4">Spending Breakdown</h2>
              <SpendingChart data={stats.byCategory} />
            </section>

            {/* Quick Tips */}
            <section className="p-6 rounded-2xl glass animate-fade-in" style={{ animationDelay: '600ms' }}>
              <h2 className="text-lg font-semibold mb-4">How to Use</h2>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">💬</span>
                  <span>Type naturally: "$25 for lunch" or "coffee 5 dollars"</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">🎤</span>
                  <span>Click the mic to add expenses by voice</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">📸</span>
                  <span>Upload bills for automatic extraction</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">🤖</span>
                  <span>AI automatically categorizes your expenses</span>
                </li>
              </ul>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Index;
