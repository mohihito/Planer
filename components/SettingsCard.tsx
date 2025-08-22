
import React from 'react';
import { CURRENCIES } from '../constants';
import CustomSelect from './CustomSelect';

interface SettingsCardProps {
    currency: string;
    onCurrencyChange: (currency: string) => void;
}

const SettingsCard: React.FC<SettingsCardProps> = ({ currency, onCurrencyChange }) => {
    return (
        <div className="bg-slate-800 rounded-xl shadow-md p-6 border border-slate-700">
            <h2 className="text-lg font-semibold text-slate-200 mb-4">Settings</h2>
            <div className="space-y-4">
                <div>
                    <label htmlFor="currency-select" className="block text-sm font-medium text-slate-300">Currency</label>
                    <CustomSelect
                        id="currency-select"
                        options={CURRENCIES}
                        value={currency}
                        onChange={onCurrencyChange}
                    />
                </div>
            </div>
        </div>
    );
};

export default SettingsCard;
