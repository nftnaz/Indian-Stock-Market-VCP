import React from 'react';
import type { Stock } from '../types';

interface StockListItemProps {
    stock: Stock;
    onSelect: () => void;
}

export const StockListItem: React.FC<StockListItemProps> = ({ stock, onSelect }) => {
    return (
        <button 
            onClick={onSelect}
            className="w-full text-left p-4 flex items-center justify-between hover:bg-overlay/50 transition-colors duration-200"
            aria-label={`View details for ${stock.name}`}
        >
            <div>
                <p className="font-bold text-text text-lg">{stock.symbol}</p>
                <p className="text-sm text-subtle">{stock.name}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-text">{stock.exchange}</p>
                <p className="text-xs text-muted">{stock.marketCap}-Cap</p>
            </div>
        </button>
    );
};