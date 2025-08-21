import React, { useState, useEffect } from 'react';
import { Transaction, TypeOption } from '../types';
import CustomSelect from './CustomSelect';
import { useToast } from './ToastProvider';

interface EditTransactionModalProps {
    transaction: Transaction;
    onSave: (transaction: Transaction) => void;
    onClose: () => void;
    incomeTypes: TypeOption[];
    expenseTypes: TypeOption[];
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
    transaction,
    onSave,
    onClose,
    incomeTypes,
    expenseTypes
}) => {
    const [name, setName] = useState(transaction.name);
    const [amount, setAmount] = useState(String(transaction.amount));
    const [description, setDescription] = useState(transaction.description);
    const [isRecurring, setIsRecurring] = useState(!!transaction.isRecurring);
    const { addToast } = useToast();

    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericAmount = parseFloat(amount);
        if (!description || !name.trim() || !numericAmount || numericAmount <= 0) {
            addToast("Please fill all fields correctly.", 'error');
            return;
        }

        onSave({
            ...transaction,
            name: name.trim(),
            description,
            amount: numericAmount,
            isRecurring,
        });
    };
    
    const typeOptions = transaction.type === 'income' ? incomeTypes : expenseTypes;

    return (
        <div 
          className="fixed inset-0 bg-black bg-opacity-70 z-40 flex justify-center items-center"
          aria-modal="true"
          role="dialog"
          onClick={onClose}
        >
            <div 
              className="bg-slate-800 rounded-xl shadow-lg p-6 w-full max-w-md m-4 border border-slate-700"
              onClick={e => e.stopPropagation()}
            >
                <h2 className="text-lg font-semibold text-slate-200 mb-4">Edit Transaction</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-type-description" className="block text-sm font-medium text-slate-300">Type</label>
                        <CustomSelect
                            id="edit-type-description"
                            options={typeOptions}
                            value={description}
                            onChange={setDescription}
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-name" className="block text-sm font-medium text-slate-300">Transaction Name</label>
                        <input
                            type="text"
                            id="edit-name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-white"
                            placeholder="e.g. Monthly salary"
                        />
                    </div>
                    <div>
                        <label htmlFor="edit-amount" className="block text-sm font-medium text-slate-300">Amount (USD)</label>
                        <input
                            type="number"
                            id="edit-amount"
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
                            id="edit-is-recurring"
                            type="checkbox"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="h-4 w-4 rounded border-slate-600 bg-slate-700 text-indigo-600 focus:ring-indigo-500"
                        />
                        <label htmlFor="edit-is-recurring" className="ml-2 block text-sm text-slate-300">
                            Recurring transaction (repeat monthly)
                        </label>
                    </div>
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="py-2 px-4 border border-slate-600 rounded-md shadow-sm text-sm font-medium text-slate-300 bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditTransactionModal;