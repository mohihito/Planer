import React from 'react';

interface MonthNavigatorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
}

const MonthNavigator: React.FC<MonthNavigatorProps> = ({ currentDate, onDateChange }) => {
  const handlePrevMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() - 1);
    onDateChange(newDate);
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + 1);
    onDateChange(newDate);
  };

  const monthName = currentDate.toLocaleString('en-US', { month: 'long' });
  const year = currentDate.getFullYear();

  return (
    <div className="bg-slate-800 rounded-xl shadow-md p-6 flex items-center justify-between border border-slate-700">
      <button 
        onClick={handlePrevMonth}
        className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Previous month"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <div className="text-center">
        <p className="text-xl font-semibold text-slate-200 capitalize">{monthName}</p>
        <p className="text-sm text-slate-400">{year}</p>
      </div>
      <button 
        onClick={handleNextMonth}
        className="p-2 rounded-full hover:bg-slate-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-label="Next month"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

export default MonthNavigator;