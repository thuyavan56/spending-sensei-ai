import { useState, useCallback, useMemo } from 'react';
import { Expense, ExpenseCategory, CATEGORIES, SpendingInsight } from '@/types/expense';

// AI-powered category detection based on keywords
const detectCategory = (text: string): ExpenseCategory => {
  const lowerText = text.toLowerCase();
  
  const categoryKeywords: Record<ExpenseCategory, string[]> = {
    food: ['lunch', 'dinner', 'breakfast', 'coffee', 'restaurant', 'pizza', 'burger', 'sushi', 'food', 'eat', 'meal', 'snack', 'grocery', 'groceries', 'supermarket'],
    transport: ['uber', 'lyft', 'taxi', 'gas', 'fuel', 'parking', 'train', 'bus', 'metro', 'subway', 'flight', 'airline', 'car'],
    shopping: ['amazon', 'store', 'mall', 'clothes', 'shoes', 'electronics', 'purchase', 'buy', 'shop'],
    bills: ['electricity', 'water', 'internet', 'phone', 'rent', 'insurance', 'subscription', 'netflix', 'spotify', 'utility'],
    entertainment: ['movie', 'cinema', 'concert', 'game', 'netflix', 'spotify', 'party', 'club', 'bar', 'drink'],
    health: ['pharmacy', 'doctor', 'hospital', 'medicine', 'gym', 'fitness', 'dental', 'medical'],
    income: ['salary', 'paycheck', 'bonus', 'refund', 'cashback', 'received', 'earned', 'income'],
    other: [],
  };

  for (const [category, keywords] of Object.entries(categoryKeywords)) {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      return category as ExpenseCategory;
    }
  }
  
  return 'other';
};

// Parse natural language input
const parseExpenseInput = (input: string): Partial<Expense> | null => {
  // Match patterns like "$50 for lunch" or "lunch $50" or "50 dollars coffee"
  const amountPatterns = [
    /\$(\d+(?:\.\d{2})?)/,
    /(\d+(?:\.\d{2})?)\s*(?:dollars?|usd)/i,
    /(\d+(?:\.\d{2})?)/,
  ];
  
  let amount: number | null = null;
  for (const pattern of amountPatterns) {
    const match = input.match(pattern);
    if (match) {
      amount = parseFloat(match[1]);
      break;
    }
  }
  
  if (!amount) return null;
  
  const category = detectCategory(input);
  const isIncome = category === 'income';
  
  return {
    amount,
    description: input.replace(/\$?\d+(?:\.\d{2})?\s*(?:dollars?|usd)?/gi, '').trim() || CATEGORIES[category].name,
    category,
    isIncome,
    date: new Date(),
  };
};

// Sample initial expenses for demo
const generateInitialExpenses = (): Expense[] => {
  const now = new Date();
  return [
    { id: '1', amount: 12.50, description: 'Coffee & Pastry', category: 'food', date: new Date(now.getTime() - 1000 * 60 * 60 * 2), merchant: 'Starbucks' },
    { id: '2', amount: 45.00, description: 'Uber to Airport', category: 'transport', date: new Date(now.getTime() - 1000 * 60 * 60 * 24), merchant: 'Uber' },
    { id: '3', amount: 89.99, description: 'New Headphones', category: 'shopping', date: new Date(now.getTime() - 1000 * 60 * 60 * 48), merchant: 'Amazon' },
    { id: '4', amount: 15.99, description: 'Netflix Subscription', category: 'bills', date: new Date(now.getTime() - 1000 * 60 * 60 * 72), merchant: 'Netflix' },
    { id: '5', amount: 32.00, description: 'Movie Night', category: 'entertainment', date: new Date(now.getTime() - 1000 * 60 * 60 * 96), merchant: 'AMC' },
    { id: '6', amount: 2500.00, description: 'Monthly Salary', category: 'income', date: new Date(now.getTime() - 1000 * 60 * 60 * 120), isIncome: true },
    { id: '7', amount: 67.50, description: 'Grocery Shopping', category: 'food', date: new Date(now.getTime() - 1000 * 60 * 60 * 144), merchant: 'Whole Foods' },
    { id: '8', amount: 25.00, description: 'Gym Membership', category: 'health', date: new Date(now.getTime() - 1000 * 60 * 60 * 168), merchant: 'Planet Fitness' },
  ];
};

export const useExpenses = () => {
  const [expenses, setExpenses] = useState<Expense[]>(generateInitialExpenses);
  const [isProcessing, setIsProcessing] = useState(false);

  const addExpense = useCallback(async (input: string): Promise<{ success: boolean; expense?: Expense; error?: string }> => {
    setIsProcessing(true);
    
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const parsed = parseExpenseInput(input);
    
    if (!parsed || !parsed.amount) {
      setIsProcessing(false);
      return { success: false, error: 'Could not parse expense. Try: "$25 for lunch" or "coffee $5"' };
    }
    
    const newExpense: Expense = {
      id: Date.now().toString(),
      amount: parsed.amount,
      description: parsed.description || 'Expense',
      category: parsed.category || 'other',
      date: parsed.date || new Date(),
      isIncome: parsed.isIncome,
    };
    
    setExpenses(prev => [newExpense, ...prev]);
    setIsProcessing(false);
    
    return { success: true, expense: newExpense };
  }, []);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  }, []);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = expenses.filter(e => {
      const expDate = new Date(e.date);
      return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
    });
    
    const totalSpent = thisMonth.filter(e => !e.isIncome).reduce((sum, e) => sum + e.amount, 0);
    const totalIncome = thisMonth.filter(e => e.isIncome).reduce((sum, e) => sum + e.amount, 0);
    
    const byCategory = thisMonth.filter(e => !e.isIncome).reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<ExpenseCategory, number>);
    
    const topCategory = Object.entries(byCategory).sort(([, a], [, b]) => b - a)[0];
    
    return {
      totalSpent,
      totalIncome,
      balance: totalIncome - totalSpent,
      byCategory,
      topCategory: topCategory ? { category: topCategory[0] as ExpenseCategory, amount: topCategory[1] } : null,
      transactionCount: thisMonth.length,
    };
  }, [expenses]);

  const insights = useMemo((): SpendingInsight[] => {
    const result: SpendingInsight[] = [];
    
    if (stats.topCategory) {
      const percentage = Math.round((stats.topCategory.amount / stats.totalSpent) * 100);
      if (percentage > 40) {
        result.push({
          type: 'warning',
          title: 'High spending detected',
          description: `${CATEGORIES[stats.topCategory.category].name} accounts for ${percentage}% of your spending.`,
          icon: '⚠️',
        });
      }
    }
    
    if (stats.balance > 0) {
      result.push({
        type: 'success',
        title: 'Positive balance',
        description: `You've saved $${stats.balance.toFixed(2)} this month. Keep it up!`,
        icon: '🎉',
      });
    }
    
    const foodSpend = stats.byCategory.food || 0;
    if (foodSpend > 200) {
      result.push({
        type: 'info',
        title: 'Food spending tip',
        description: 'Consider meal prepping to reduce dining expenses.',
        icon: '💡',
      });
    }
    
    return result;
  }, [stats]);

  return {
    expenses,
    addExpense,
    deleteExpense,
    stats,
    insights,
    isProcessing,
  };
};
