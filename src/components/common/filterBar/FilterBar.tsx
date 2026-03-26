import React from 'react';
import { Filter } from 'lucide-react';

interface FilterOption {
  value: string;
  label: string;
}

interface FilterBarProps {
  label: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  label,
  options,
  value,
  onChange,
  className = '',
}) => {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400 shrink-0" aria-hidden />
      <label htmlFor={`filter-${label}`} className="text-sm text-slate-600 dark:text-slate-400 whitespace-nowrap">
        {label}:
      </label>
      <select
        id={`filter-${label}`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="min-w-[140px] px-3 py-2 bg-slate-100 border border-slate-300 rounded-lg text-sm text-slate-900 dark:bg-slate-700/50 dark:border-slate-600 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
      >
        <option value="">All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

