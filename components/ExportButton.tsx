import React from 'react';
import { Transaction, TypeOption } from '../types';
import DownloadIcon from './icons/DownloadIcon';

interface ExportButtonProps {
    transactions: Transaction[];
    income: number;
    expenses: number;
    balance: number;
    currentDate: Date;
    incomeTypes: TypeOption[];
    expenseTypes: TypeOption[];
}

const ExportButton: React.FC<ExportButtonProps> = ({
    transactions,
    income,
    expenses,
    balance,
    currentDate,
    incomeTypes,
    expenseTypes
}) => {

    const formatCurrencyForCSV = (amount: number) => {
        return amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    };
    
    const escapeCSV = (field: string | number) => {
        const str = String(field);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
            const escapedStr = str.replace(/"/g, '""');
            return `"${escapedStr}"`;
        }
        return str;
    };

    const handleExport = () => {
        const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
        const year = currentDate.getFullYear();
        const allTypes = [...incomeTypes, ...expenseTypes];

        const getTypeLabel = (value: string) => {
            const typeOption = allTypes.find(t => t.value === value);
            return typeOption ? typeOption.label : value;
        };

        const headers = [
            'Date',
            'Name',
            'Type',
            'Amount (USD)',
            'Transaction Kind'
        ];

        const summary = [
            [`Financial report for: ${monthName} ${year}`],
            [`Total income: ${formatCurrencyForCSV(income)} USD`],
            [`Total expenses: ${formatCurrencyForCSV(expenses)} USD`],
            [`Balance: ${formatCurrencyForCSV(balance)} USD`],
            []
        ];

        const transactionRows = transactions
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
            .map(t => [
                t.date,
                t.name,
                getTypeLabel(t.description),
                formatCurrencyForCSV(t.amount),
                t.type === 'income' ? 'Income' : 'Expense',
            ]);

        const csvContent = [
            ...summary.map(row => row.join(',')),
            headers.map(escapeCSV).join(','),
            ...transactionRows.map(row => row.map(escapeCSV).join(','))
        ].join('\n');
        
        const bom = new Uint8Array([0xEF, 0xBB, 0xBF]);
        const blob = new Blob([bom, csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        
        link.setAttribute('href', url);
        link.setAttribute('download', `Financial-Report-${monthName}-${year}.csv`);
        link.style.visibility = 'hidden';
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <button
            onClick={handleExport}
            disabled={transactions.length === 0}
            className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 disabled:bg-slate-600/50 disabled:text-slate-400 disabled:cursor-not-allowed transition-colors"
        >
            <DownloadIcon />
            Export to CSV
        </button>
    );
};

export default ExportButton;