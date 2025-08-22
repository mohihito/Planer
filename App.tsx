import React, { useState, useMemo, useCallback } from 'react';
import { Transaction, AggregatedTransactionGroup } from './types';
import { useLocalStorage } from './hooks/useLocalStorage';
import MonthNavigator from './components/MonthNavigator';
import SummaryCard from './components/SummaryCard';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import ExportButton from './components/ExportButton';
import ImportButton from './components/ImportButton';
import { INCOME_TYPES, EXPENSE_TYPES, INCOME_SORT_ORDER, EXPENSE_SORT_ORDER } from './constants';
import EditTransactionModal from './components/EditTransactionModal';
import ConfirmDeleteModal from './components/ConfirmDeleteModal';
import { useToast } from './components/ToastProvider';

function App() {
  const [transactions, setTransactions] = useLocalStorage<Transaction[]>('transactions', []);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const { addToast } = useToast();

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === currentDate.getFullYear() &&
             transactionDate.getMonth() === currentDate.getMonth();
    });
  }, [transactions, currentDate]);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    const income = filteredTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expenses = filteredTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      totalIncome: income,
      totalExpenses: expenses,
      balance: income - expenses
    };
  }, [filteredTransactions]);

  const totalSavings = useMemo(() => {
    return transactions
      .filter(t => t.type === 'expense' && t.description === 'savings')
      .reduce((sum, t) => sum + t.amount, 0);
  }, [transactions]);
  
  const addTransaction = useCallback((transaction: Omit<Transaction, 'id' | 'recurringKey'> & { isRecurring?: boolean }) => {
    setTransactions(prev => {
        const newTransactions = [...prev];
        const newId = crypto.randomUUID();

        if (transaction.isRecurring) {
            const recurringKey = crypto.randomUUID();
            const baseTransaction: Transaction = { ...transaction, id: newId, recurringKey, isRecurring: true };
            newTransactions.push(baseTransaction);

            let futureDate = new Date(baseTransaction.date);
            for (let i = 0; i < 24; i++) { // Propagate for next 24 months
                const currentDay = futureDate.getDate();
                futureDate.setMonth(futureDate.getMonth() + 1);
                // Handle end of month correctly
                if (futureDate.getDate() !== currentDay) {
                  futureDate.setDate(0); // Go to last day of previous month
                }

                newTransactions.push({
                    ...baseTransaction,
                    id: crypto.randomUUID(),
                    date: futureDate.toISOString().split('T')[0],
                });
            }
        } else {
            newTransactions.push({ ...transaction, id: newId, isRecurring: false });
        }
        return newTransactions;
    });
    addToast('Transakcja dodana pomyślnie', 'success');
  }, [setTransactions, addToast]);

  const updateTransaction = useCallback((updatedTransaction: Transaction) => {
    setTransactions(prev => {
        const originalTransaction = prev.find(t => t.id === updatedTransaction.id);
        if (!originalTransaction) return prev;

        // Remove the original transaction and any future occurrences
        let transactionsToKeep = prev.filter(t => {
            if (originalTransaction.recurringKey) {
                return t.recurringKey !== originalTransaction.recurringKey || new Date(t.date) < new Date(originalTransaction.date);
            }
            return t.id !== originalTransaction.id;
        });

        const newTransactions = [...transactionsToKeep];

        if (updatedTransaction.isRecurring) {
            const recurringKey = originalTransaction.recurringKey || crypto.randomUUID();
            const baseTransaction: Transaction = { ...updatedTransaction, recurringKey, isRecurring: true };
            newTransactions.push(baseTransaction);

            let futureDate = new Date(baseTransaction.date);
            for (let i = 0; i < 24; i++) {
                const currentDay = futureDate.getDate();
                futureDate.setMonth(futureDate.getMonth() + 1);
                 if (futureDate.getDate() !== currentDay) {
                  futureDate.setDate(0);
                }
                newTransactions.push({
                    ...baseTransaction,
                    id: crypto.randomUUID(),
                    date: futureDate.toISOString().split('T')[0],
                });
            }
        } else {
            newTransactions.push({ ...updatedTransaction, recurringKey: undefined, isRecurring: false });
        }
        return newTransactions;
    });
    setEditingTransaction(null);
    addToast('Transakcja zaktualizowana', 'success');
  }, [setTransactions, addToast]);

  const initiateDelete = useCallback((transaction: Transaction) => {
      if (transaction.recurringKey) {
          setDeletingTransaction(transaction);
      } else {
          setTransactions(prev => prev.filter(t => t.id !== transaction.id));
          addToast('Transakcja usunięta', 'success');
      }
  }, [setTransactions, addToast]);

  const handleDeleteSingle = useCallback((transactionId: string) => {
      setTransactions(prev => prev.filter(t => t.id !== transactionId));
      addToast('Usunięto pojedynczą transakcję.', 'success');
      setDeletingTransaction(null);
  }, [setTransactions, addToast]);

  const handleDeleteFuture = useCallback((transactionToDelete: Transaction) => {
      setTransactions(prev => prev.filter(t => 
          t.recurringKey !== transactionToDelete.recurringKey || new Date(t.date) < new Date(transactionToDelete.date)
      ));
      addToast('Usunięto transakcję i wszystkie przyszłe wystąpienia.', 'success');
      setDeletingTransaction(null);
  }, [setTransactions, addToast]);


  const handleImportTransactions = useCallback((importedTransactions: Omit<Transaction, 'id'>[]) => {
    if (window.confirm("Czy na pewno chcesz zastąpić wszystkie istniejące dane nowymi danymi z pliku? Ta operacja jest nieodwracalna.")) {
        const transactionsWithIds = importedTransactions.map(t => ({ ...t, id: crypto.randomUUID() }));
        setTransactions(transactionsWithIds);
        addToast(`Pomyślnie zaimportowano ${transactionsWithIds.length} transakcji.`, 'success');
    }
  }, [setTransactions, addToast]);

 const aggregateTransactions = useCallback((trans: Transaction[], sortOrder: string[]): AggregatedTransactionGroup[] => {
    const groups = new Map<string, { totalAmount: number; transactions: Transaction[] }>();
    for (const t of trans) {
        if (!groups.has(t.description)) {
            groups.set(t.description, { totalAmount: 0, transactions: [] });
        }
        const group = groups.get(t.description)!;
        group.totalAmount += t.amount;
        group.transactions.push(t);
    }
    return Array.from(groups.entries()).map(([description, data]) => ({
        description,
        totalAmount: data.totalAmount,
        transactions: data.transactions.sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    })).sort((a,b) => {
        const indexA = sortOrder.indexOf(a.description);
        const indexB = sortOrder.indexOf(b.description);
        if (indexA === -1) return 1;
        if (indexB === -1) return -1;
        return indexA - indexB;
    });
  }, []);


  const incomeTransactions = useMemo(() => filteredTransactions.filter(t => t.type === 'income'), [filteredTransactions]);
  const expenseTransactions = useMemo(() => filteredTransactions.filter(t => t.type === 'expense'), [filteredTransactions]);

  const aggregatedIncome = useMemo(() => aggregateTransactions(incomeTransactions, INCOME_SORT_ORDER), [incomeTransactions, aggregateTransactions]);
  const aggregatedExpenses = useMemo(() => aggregateTransactions(expenseTransactions, EXPENSE_SORT_ORDER), [expenseTransactions, aggregateTransactions]);


  return (
    <div className="min-h-screen bg-slate-900 font-sans">
      <header className="bg-slate-800/50 border-b border-slate-700 shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight text-slate-100">
            Miesięczny Planer Finansowy
          </h1>
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column */}
          <div className="lg:w-1/3 flex flex-col gap-8">
            <MonthNavigator currentDate={currentDate} onDateChange={setCurrentDate} />
            <SummaryCard income={totalIncome} expenses={totalExpenses} balance={balance} totalSavings={totalSavings} />
            <TransactionForm 
              onSubmit={addTransaction} 
            />
            <div className="bg-slate-800 rounded-xl shadow-md p-6 border border-slate-700">
              <h2 className="text-lg font-semibold text-slate-200 mb-4">Zarządzanie Danymi</h2>
              <div className="grid grid-cols-1 gap-4">
                <ExportButton
                  transactions={filteredTransactions}
                  income={totalIncome}
                  expenses={totalExpenses}
                  balance={balance}
                  currentDate={currentDate}
                  incomeTypes={INCOME_TYPES}
                  expenseTypes={EXPENSE_TYPES}
                />
                <ImportButton
                  onImport={handleImportTransactions}
                  incomeTypes={INCOME_TYPES}
                  expenseTypes={EXPENSE_TYPES}
                />
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="lg:w-2/3 flex flex-col gap-8">
            <div className="flex flex-col md:flex-row gap-8">
              <TransactionList 
                title="Przychody"
                groups={aggregatedIncome}
                onInitiateDelete={initiateDelete}
                onEdit={setEditingTransaction}
                typeOptions={INCOME_TYPES}
                type="income"
              />
              <TransactionList
                title="Wydatki"
                groups={aggregatedExpenses}
                onInitiateDelete={initiateDelete}
                onEdit={setEditingTransaction}
                typeOptions={EXPENSE_TYPES}
                type="expense"
                totalAmountForPercentage={totalExpenses}
              />
            </div>
          </div>
        </div>
      </main>
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onSave={updateTransaction}
          onClose={() => setEditingTransaction(null)}
          incomeTypes={INCOME_TYPES}
          expenseTypes={EXPENSE_TYPES}
        />
      )}
      {deletingTransaction && (
        <ConfirmDeleteModal
            transaction={deletingTransaction}
            onClose={() => setDeletingTransaction(null)}
            onConfirmSingle={() => handleDeleteSingle(deletingTransaction.id)}
            onConfirmFuture={() => handleDeleteFuture(deletingTransaction)}
        />
      )}
    </div>
  );
}

export default App;