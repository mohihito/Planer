import React, { useState } from 'react';
import { Transaction, TransactionType } from '../types';
import { INCOME_TYPES, EXPENSE_TYPES } from '../constants';
import CustomSelect from './CustomSelect';
import { useToast } from './ToastProvider';

interface TransactionFormProps {
  onSubmit: (transaction: Omit<Transaction, 'id' | 'recurringKey'> & { isRecurring?: boolean }) => void;
}

const TransactionForm: React.FC<TransactionFormProps> = ({ onSubmit }) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState(EXPENSE_TYPES[0].value);
  const [isRecurring, setIsRecurring] = useState(false);
  const { addToast } = useToast();

  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (newType === 'expense') {
        setDescription(EXPENSE_TYPES[0].value);
    } else {
        setDescription(INCOME_TYPES[0].value);
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numericAmount = parseFloat(amount);
    if (!description || !name.trim() || !numericAmount || numericAmount <= 0) {
      addToast("Please fill all fields correctly.", 'error');
      return;
    }
    
    onSubmit({
      date: new Date().toISOString().split('T')[0],
      name: name.trim(),
      description,
      amount: numericAmount,
      type,
      isRecurring,
    });

    setName('');
    setAmount('');
    setIsRecurring(false);
  };

  const typeOptions = type === 'income' ? INCOME_TYPES : EXPENSE_TYPES;

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <div className="flex border border-slate-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => handleTypeChange('income')}
              className={`w-1/2 py-2 rounded-md text-sm font-medium transition-colors ${type === 'income' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Income
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('expense')}
              className={`w-1/2 py-2 rounded-md text-sm font-medium transition-colors ${type === 'expense' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-300 hover:bg-slate-700'}`}
            >
              Expense
            </button>
          </div>
        </div>
        <div>
          <label htmlFor="type-description" className="block text-sm font-medium text-slate-300">Type</label>
          <CustomSelect
            id="type-description"
            options={typeOptions}
            value={description}
            onChange={setDescription}
          />
        </div>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-slate-300">Transaction Name</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
            placeholder="e.g. Monthly salary"
          />
        </div>
        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-slate-300">Amount (USD)</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
        </div>
        <div className="flex items-center">
            <input
                id="is-recurring"
                type="checkbox"
                checked={isRecurring}
                onChange={(e) => setIsRecurring(e.target.checked)}
                className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
            />
            <label htmlFor="is-recurring" className="ml-2 block text-sm text-slate-300">
                Recurring transaction (repeat monthly)
            </label>
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Add
        </button>
      </form>
    </div>
  );
};

export default TransactionForm;