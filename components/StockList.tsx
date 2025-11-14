
import React, { useState } from 'react';
import { StockListItem } from './StockListItem.tsx';
import { StockChartModal } from './StockChartModal.tsx';
import type { Stock } from '../types.ts';

interface StockListProps {
    stocks: Stock[];
}

export const StockList: React.FC<StockListProps> = ({ stocks }) => {
    const [selectedStock, setSelectedStock] = useState<Stock | null>(null);

    return (
        <>
            <div className="bg-surface rounded-xl shadow-lg animate-fade-in">
                <div className="p-4 border-b border-overlay">
                    <h3 className="text-lg font-semibold text-text">Screener Results</h3>
                    <p className="text-sm text-subtle">{stocks.length} potential VCP candidate(s) found.</p>
                </div>
                <div className="divide-y divide-overlay">
                    {stocks.map(stock => (
                        <StockListItem 
                            key={stock.symbol}
                            stock={stock}
                            onSelect={() => setSelectedStock(stock)}
                        />
                    ))}
                </div>
            </div>
            {selectedStock && (
                <StockChartModal 
                    stock={selectedStock} 
                    onClose={() => setSelectedStock(null)} 
                />
            )}
        </>
    );
};