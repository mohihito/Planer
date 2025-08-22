
import { TypeOption } from './types';

export const CURRENCIES: TypeOption[] = [
    { value: 'USD', label: 'USD - United States Dollar' },
    { value: 'EUR', label: 'EUR - Euro' },
    { value: 'PLN', label: 'PLN - Polish Złoty' },
    { value: 'GBP', label: 'GBP - British Pound' },
];

export const INCOME_TYPES: TypeOption[] = [
    { value: 'full_time', label: 'Full-time' },
    { value: 'credit', label: 'Loan' },
    { value: 'additional', label: 'Additional' },
];

export const EXPENSE_TYPES: TypeOption[] = [
    { value: 'basic', label: 'Basic' },
    { value: 'necessary', label: 'Necessary' },
    { value: 'wants', label: 'Wants' },
    { value: 'investment', label: 'Investment' },
    { value: 'debt_repayment', label: 'Debt Repayment' },
    { value: 'savings', label: 'Savings' },
];

export const INCOME_SORT_ORDER = ['full_time', 'credit', 'additional'];

export const EXPENSE_SORT_ORDER = [
    'basic',
    'necessary',
    'debt_repayment',
    'wants',
    'investment',
    'savings',
];
