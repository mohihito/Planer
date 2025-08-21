import React, { useRef } from 'react';
import { Transaction, TypeOption } from '../types';
import UploadIcon from './icons/UploadIcon';
import { useToast } from './ToastProvider';

interface ImportButtonProps {
    onImport: (transactions: Omit<Transaction, 'id'>[]) => void;
    incomeTypes: TypeOption[];
    expenseTypes: TypeOption[];
}

const ImportButton: React.FC<ImportButtonProps> = ({ onImport, incomeTypes, expenseTypes }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { addToast } = useToast();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            if (text) {
                parseCSV(text);
            }
        };
        reader.readAsText(file, 'UTF-8');
        event.target.value = ''; // Reset file input to allow re-uploading the same file
    };

    const parseCSVLine = (line: string): string[] => {
        const regex = /(?:"([^"]*(?:""[^"]*)*)"|([^,]*))(?:,|$)/g;
        const fields: string[] = [];
        let match;
        const trimmedLine = line.trim();
        if (trimmedLine === '') {
            return [];
        }
        
        while ((match = regex.exec(trimmedLine))) {
            if (match.index === trimmedLine.length && match[0] === '') {
                break;
            }
            const value = match[1] !== undefined ? match[1].replace(/""/g, '"') : match[2];
            fields.push(value);
        }
        return fields;
    };

    const parseCSV = (csvText: string) => {
        const allTypes = [...incomeTypes, ...expenseTypes];
        const lines = csvText.split('\n').filter(line => line.trim() !== '');
        
        const header = 'Date,Name,Type,Amount (USD),Transaction Kind';
        const headerIndex = lines.findIndex(line => line.trim().startsWith(header));

        if (headerIndex === -1) {
            addToast(`Invalid CSV file format.`, 'error');
            return;
        }

        const dataLines = lines.slice(headerIndex + 1);
        const importedTransactions: Omit<Transaction, 'id'>[] = [];

        for (const line of dataLines) {
            try {
                const fields = parseCSVLine(line);
                if (fields.length < 5) continue;
                const [date, name, typeLabel, amountStr, transactionTypeStr] = fields;

                if (!date || !name || !typeLabel || !amountStr || !transactionTypeStr) continue;

                const amount = parseFloat(amountStr.trim().replace(/\s/g, '').replace(',', '.'));
                
                const type = transactionTypeStr.trim() === 'Income' ? 'income' : 'expense';
                
                const typeOption = allTypes.find(opt => opt.label === typeLabel.trim());
                if (!typeOption) {
                    console.warn(`Type not found for label: ${typeLabel.trim()}`);
                    continue;
                }
                
                if (isNaN(amount) || !Date.parse(date.trim())) {
                    console.warn(`Skipped invalid row: ${line}`);
                    continue;
                }

                importedTransactions.push({
                    date: new Date(date.trim()).toISOString().split('T')[0],
                    name: name.trim(),
                    description: typeOption.value,
                    amount,
                    type,
                });

            } catch (error) {
                console.error(`Error parsing row: ${line}`, error);
            }
        }
        
        if (importedTransactions.length > 0) {
            onImport(importedTransactions);
        } else {
            addToast("No valid transactions found to import.", 'error');
        }
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".csv"
                className="hidden"
            />
            <button
                onClick={handleImportClick}
                className="w-full flex items-center justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-slate-700 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
                <UploadIcon />
                Import from CSV
            </button>
        </>
    );
};

export default ImportButton;