import React, { useState } from 'react';
import type { ScanFilters as ScanFiltersType } from '../types';

interface ScanFiltersProps {
    onScan: (filters: ScanFiltersType) => void;
}

export const ScanFilters: React.FC<ScanFiltersProps> = ({ onScan }) => {
    const [filters, setFilters] = useState<ScanFiltersType>({
        exchange: 'ALL',
        marketCap: 'ALL',
    });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onScan(filters);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-surface p-4 rounded-xl shadow-lg w-full max-w-3xl mx-auto">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                <div className="flex flex-col gap-2">
                    <label htmlFor="exchange" className="text-sm font-medium text-subtle">Exchange</label>
                    <select
                        id="exchange"
                        name="exchange"
                        value={filters.exchange}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 bg-overlay border border-surface rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-focus"
                    >
                        <option value="ALL">All Exchanges</option>
                        <option value="NSE">NSE</option>
                        <option value="BSE">BSE</option>
                    </select>
                </div>
                 <div className="flex flex-col gap-2">
                    <label htmlFor="marketCap" className="text-sm font-medium text-subtle">Market Cap</label>
                    <select
                        id="marketCap"
                        name="marketCap"
                        value={filters.marketCap}
                        onChange={handleFilterChange}
                        className="w-full px-3 py-2 bg-overlay border border-surface rounded-lg text-text focus:outline-none focus:ring-2 focus:ring-primary-focus"
                    >
                        <option value="ALL">All Market Caps</option>
                        <option value="Large">Large-Cap</option>
                        <option value="Mid">Mid-Cap</option>
                        <option value="Small">Small-Cap</option>
                    </select>
                </div>
                <button
                    type="submit"
                    className="flex items-center justify-center gap-3 w-full px-6 py-2 bg-primary text-text font-bold text-base rounded-lg shadow-lg hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary-focus focus:ring-opacity-50 transition-all duration-300 transform hover:scale-105"
                >
                    Apply Filters
                </button>
            </div>
        </form>
    );
};