import { TypeOption } from './types';

export const INCOME_TYPES: TypeOption[] = [
    { value: 'full_time', label: 'Etat' },
    { value: 'credit', label: 'Kredyt' },
    { value: 'additional', label: 'Dodatkowe' },
];

export const EXPENSE_TYPES: TypeOption[] = [
    { value: 'basic', label: 'Podstawowe' },
    { value: 'necessary', label: 'Bardzo potrzebne' },
    { value: 'wants', label: 'Zachcianki' },
    { value: 'investment', label: 'Inwestycja' },
    { value: 'debt_repayment', label: 'Spłata długów' },
    { value: 'savings', label: 'Oszczędności' },
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