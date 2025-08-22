
import React from 'react';
import { Transaction, TransactionType, TypeOption, AggregatedTransactionGroup } from '../types';
import TrashIcon from './icons/TrashIcon';
import PencilIcon from './icons/PencilIcon';
import RepeatIcon from './icons/RepeatIcon';

interface TransactionListProps {
  title: string;
  groups: AggregatedTransactionGroup[];
  onInitiateDelete: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  typeOptions: TypeOption[];
  type: TransactionType;
  totalAmountForPercentage?: number;
  currency: string;
}

const TransactionList: React.FC<TransactionListProps> = ({ title, groups, onInitiateDelete, onEdit, typeOptions, type, totalAmountForPercentage, currency }) => {
  const getTypeLabel = (descriptionValue: string) => {
    const option = typeOptions.find(o => o.value === descriptionValue);
    return option ? option.label : descriptionValue;
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: currency }).format(amount);
  };

  const getHighlightStyles = (description: string, transactionType: TransactionType) => {
    const expenseStyles: { [key: string]: any } = {
        'savings': { container: 'border-yellow-500/50 bg-yellow-500/10', title: 'text-yellow-300', amount: 'text-yellow-400' },
        'wants': { container: 'border-red-500/50 bg-red-500/10', title: 'text-red-300', amount: 'text-red-400' },
        'debt_repayment': { container: 'border-green-500/50 bg-green-500/10', title: 'text-green-300', amount: 'text-green-400' },
        'investment': { container: 'border-blue-500/50 bg-blue-500/10', title: 'text-blue-300', amount: 'text-blue-400' },
    };
    
    const incomeStyles: { [key: string]: any } = {
        'credit': { container: 'border-red-500/50 bg-red-500/10', title: 'text-red-300', amount: 'text-red-400' },
        'additional': { container: 'border-green-500/50 bg-green-500/10', title: 'text-green-300', amount: 'text-green-400' },
    };

    const styles = transactionType === 'expense' ? expenseStyles : incomeStyles;
    
    return styles[description] || { 
        container: 'border-slate-700',
        title: 'text-slate-200',
        amount: 'text-slate-300',
    };
  };

  const titleColor = type === 'income' ? 'text-green-400' : 'text-red-400';

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-6 w-full border border-slate-700">
      <h2 className={`text-lg font-semibold mb-4 ${titleColor}`}>{title}</h2>
      <div className="space-y-4 pr-2">
        {groups.length > 0 ? (
          groups.map(group => {
            const highlightStyles = getHighlightStyles(group.description, type);
            const groupClasses = `bg-slate-800/50 border rounded-lg p-3 transition-colors ${highlightStyles.container}`;

            return (
              <div key={group.description} className={groupClasses}>
                <div className="flex justify-between items-center w-full mb-2">
                  <div className="flex items-baseline gap-2">
                    <p className={`font-medium ${highlightStyles.title}`}>{getTypeLabel(group.description)}</p>
                    {type === 'expense' && totalAmountForPercentage && totalAmountForPercentage > 0 && (
                      <span className="text-sm font-normal text-slate-400">
                        ({((group.totalAmount / totalAmountForPercentage) * 100).toFixed(1)}%)
                      </span>
                    )}
                  </div>
                  <p className={`font-semibold ${highlightStyles.amount}`}>{formatCurrency(group.totalAmount)}</p>
                </div>
                <div className="space-y-2">
                  {group.transactions.map(transaction => (
                    <div key={transaction.id} className="flex items-center p-2 bg-slate-700/50 rounded-md group">
                       <div className="flex-grow flex items-center gap-2">
                         {transaction.recurringKey && (
                            <div className="flex-shrink-0 text-slate-500" title="Recurring transaction">
                                <RepeatIcon />
                            </div>
                         )}
                         <div>
                            <p className="text-sm font-medium text-slate-200">{transaction.name}</p>
                            <p className="text-sm text-slate-300 mt-1">{formatCurrency(transaction.amount)}</p>
                         </div>
                       </div>
                       <div className="flex items-center">
                          <button
                            onClick={() => onEdit(transaction)}
                            className="ml-2 p-1.5 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-blue-900/50 hover:text-blue-400 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-opacity"
                            aria-label="Edit transaction"
                          >
                            <PencilIcon />
                          </button>
                          <button
                            onClick={() => onInitiateDelete(transaction)}
                            className="ml-1 p-1.5 rounded-full text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-red-900/50 hover:text-red-400 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 transition-opacity"
                            aria-label="Delete transaction"
                          >
                            <TrashIcon />
                          </button>
                       </div>
                     </div>
                  ))}
                </div>
              </div>
            )
          })
        ) : (
          <div className="text-center py-10">
            <p className="text-slate-500">No transactions this month.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionList;
