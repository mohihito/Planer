import React, { useState, useRef, useEffect } from 'react';
import ChevronDownIcon from './icons/ChevronDownIcon';

interface Option {
    value: string;
    label: string;
}

interface CustomSelectProps {
  options: Option[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ options, value, onChange, id }) => {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(opt => opt.value === value);

  const handleClickOutside = (event: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOptionClick = (newValue: string) => {
    onChange(newValue);
    setIsOpen(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        setIsOpen(!isOpen);
    }
  };

  const handleOptionKeyDown = (e: React.KeyboardEvent, newValue: string) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        handleOptionClick(newValue);
    }
  };

  return (
    <div className="relative" ref={selectRef}>
      <button
        type="button"
        id={id}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleKeyDown}
        className="mt-1 relative w-full bg-slate-700 border border-slate-600 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="block truncate text-white">{selectedOption?.label}</span>
        <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
          <ChevronDownIcon />
        </span>
      </button>

      {isOpen && (
        <ul
          className="absolute z-10 mt-1 w-full bg-slate-700 shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm"
          tabIndex={-1}
          role="listbox"
          aria-activedescendant={value}
        >
          {options.map(option => (
            <li
              key={option.value}
              id={option.value}
              onClick={() => handleOptionClick(option.value)}
              onKeyDown={(e) => handleOptionKeyDown(e, option.value)}
              className={`cursor-pointer select-none relative py-2 pl-3 pr-9 transition-colors ${
                option.value === value
                  ? 'text-white bg-indigo-600'
                  : 'text-slate-200 hover:bg-indigo-500 hover:text-white'
              }`}
              role="option"
              aria-selected={option.value === value}
              tabIndex={0}
            >
              <span className={`block truncate ${option.value === value ? 'font-semibold' : 'font-normal'}`}>
                {option.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomSelect;