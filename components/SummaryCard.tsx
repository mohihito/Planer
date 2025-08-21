import React from 'react';

interface SummaryCardProps {
  income: number;
  expenses: number;
  balance: number;
  totalSavings: number;
}

const SummaryCard: React.FC<SummaryCardProps> = ({ income, expenses, balance, totalSavings }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
  };

  const getBalanceStyle = () => {
    if (balance > 0) {
      return {
        colorClass: 'text-green-400',
        formattedBalance: `+${formatCurrency(balance)}`,
      };
    }
    if (balance < 0) {
      return {
        colorClass: 'text-red-400',
        formattedBalance: formatCurrency(balance),
      };
    }
    return {
      colorClass: 'text-slate-100',
      formattedBalance: formatCurrency(balance),
    };
  };

  const { colorClass, formattedBalance } = getBalanceStyle();

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-6 border border-slate-700">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">Monthly Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Income</span>
          <span className="font-medium text-green-400">{formatCurrency(income)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-slate-400">Expenses</span>
          <span className="font-medium text-red-400">{formatCurrency(expenses)}</span>
        </div>
         <div className="flex justify-between items-center">
          <span className="text-slate-400">Savings (Total)</span>
          <span className="font-medium text-yellow-400">{formatCurrency(totalSavings)}</span>
        </div>
        <hr className="my-4 border-slate-700" />
        <div className="flex justify-between items-center text-lg">
          <span className="font-semibold text-slate-200">Balance</span>
          <span className={`font-bold ${colorClass}`}>
            {formattedBalance}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;