import React from 'react';
import type { Stock } from '../types';

interface StockListItemProps {
    stock: Stock;
}

export const StockListItem: React.FC<StockListItemProps> = ({ stock }) => {
    return (
        <div className="p-4 flex items-center justify-between">
            <div>
                <p className="font-bold text-text text-lg">{stock.symbol}</p>
                <p className="text-sm text-subtle">{stock.name}</p>
            </div>
            <div className="text-right">
                <p className="text-sm font-medium text-text">{stock.exchange}</p>
                <p className="text-xs text-muted">{stock.marketCap}-Cap</p>
            </div>
        </div>
    );
};
