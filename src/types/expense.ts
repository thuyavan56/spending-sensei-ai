export type ExpenseCategory = 
  | 'food'
  | 'transport'
  | 'shopping'
  | 'bills'
  | 'entertainment'
  | 'health'
  | 'income'
  | 'other';

export interface Expense {
  id: string;
  amount: number;
  description: string;
  category: ExpenseCategory;
  date: Date;
  merchant?: string;
  isIncome?: boolean;
}

export interface CategoryInfo {
  name: string;
  icon: string;
  color: string;
  bgClass: string;
}

export const CATEGORIES: Record<ExpenseCategory, CategoryInfo> = {
  food: { name: 'Food & Dining', icon: '🍔', color: 'hsl(25, 95%, 55%)', bgClass: 'category-food' },
  transport: { name: 'Transport', icon: '🚗', color: 'hsl(210, 90%, 55%)', bgClass: 'category-transport' },
  shopping: { name: 'Shopping', icon: '🛍️', color: 'hsl(330, 85%, 60%)', bgClass: 'category-shopping' },
  bills: { name: 'Bills & Utilities', icon: '💡', color: 'hsl(270, 70%, 60%)', bgClass: 'category-bills' },
  entertainment: { name: 'Entertainment', icon: '🎬', color: 'hsl(150, 70%, 45%)', bgClass: 'category-entertainment' },
  health: { name: 'Health', icon: '💊', color: 'hsl(0, 75%, 55%)', bgClass: 'category-health' },
  income: { name: 'Income', icon: '💰', color: 'hsl(162, 72%, 50%)', bgClass: 'category-income' },
  other: { name: 'Other', icon: '📦', color: 'hsl(222, 30%, 50%)', bgClass: 'category-other' },
};

export interface SpendingInsight {
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  icon: string;
}
