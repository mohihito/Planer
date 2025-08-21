export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  date: string; // ISO string format 'YYYY-MM-DD'
  name: string;
  description: string;
  amount: number;
  type: TransactionType;
  recurringKey?: string;
  isRecurring?: boolean;
}

export interface TypeOption {
    value: string;
    label: string;
}

export interface AggregatedTransactionGroup {
  description: string; // e.g., 'full_time'
  totalAmount: number;
  transactions: Transaction[];
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  message: string;
  type: ToastType;
}