import React, { useEffect } from 'react';
import { Transaction } from '../types';
import WarningIcon from './icons/WarningIcon';

interface ConfirmDeleteModalProps {
    transaction: Transaction;
    onClose: () => void;
    onConfirmSingle: () => void;
    onConfirmFuture: () => void;
}

const ConfirmDeleteModal: React.FC<ConfirmDeleteModalProps> = ({
    transaction,
    onClose,
    onConfirmSingle,
    onConfirmFuture
}) => {
    useEffect(() => {
        const handleEsc = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

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
                <div className="flex items-start">
                    <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-900/50 sm:mx-0 sm:h-10 sm:w-10">
                        <WarningIcon />
                    </div>
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                        <h3 className="text-lg leading-6 font-medium text-slate-100">
                            Delete Recurring Transaction
                        </h3>
                        <div className="mt-2">
                            <p className="text-sm text-slate-400">
                                This is a recurring transaction. Please choose which version(s) you want to delete:
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
                    <button
                        type="button"
                        onClick={onConfirmFuture}
                        className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
                    >
                        Delete this and future ones
                    </button>
                    <button
                        type="button"
                        onClick={onConfirmSingle}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-slate-700 text-base font-medium text-slate-200 hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        Delete only this one
                    </button>
                     <button
                        type="button"
                        onClick={onClose}
                        className="mt-3 w-full inline-flex justify-center rounded-md border border-slate-600 shadow-sm px-4 py-2 bg-transparent text-base font-medium text-slate-300 hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 sm:mt-0 sm:w-auto sm:text-sm"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmDeleteModal;