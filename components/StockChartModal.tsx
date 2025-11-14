import React, { useState, useCallback } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { getVcpAnalysis } from '../services/geminiService';
import type { Stock } from '../types';
import { LoadingIcon, CloseIcon } from './icons';

interface StockChartModalProps {
    stock: Stock;
    onClose: () => void;
}

// Simulated data representing a VCP
const chartData = [
    { name: 'Wk 1', price: 100, vol: 30 },
    { name: 'Wk 2', price: 110, vol: 28 },
    { name: 'Wk 3', price: 105, vol: 25 },
    { name: 'Wk 4', price: 115, vol: 22 },
    { name: 'Wk 5', price: 112, vol: 18 },
    { name: 'Wk 6', price: 118, vol: 15 },
    { name: 'Wk 7', price: 116, vol: 10 },
    { name: 'Wk 8', price: 120, vol: 8 },
    { name: 'Wk 9', price: 119, vol: 5 },
    { name: 'Wk 10', price: 121, vol: 3 },
];


export const StockChartModal: React.FC<StockChartModalProps> = ({ stock, onClose }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [analysis, setAnalysis] = useState('');
    const [error, setError] = useState('');

    const handleGenerateAnalysis = useCallback(async () => {
        setIsLoading(true);
        setError('');
        setAnalysis('');
        try {
            const result = await getVcpAnalysis(stock);
            setAnalysis(result);
        } catch (e) {
            setError('Failed to generate analysis. Please try again.');
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }, [stock]);
    
    const formattedAnalysis = analysis.replace(/\n/g, '<br />');

    return (
        <div 
            className="fixed inset-0 bg-base/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
            onClick={onClose}
            role="dialog"
            aria-modal="true"
            aria-labelledby="stock-modal-title"
        >
            <div 
                className="bg-surface rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
                onClick={e => e.stopPropagation()}
            >
                <header className="p-4 flex items-center justify-between border-b border-overlay">
                    <div>
                        <h2 id="stock-modal-title" className="text-xl font-bold text-text">{stock.symbol}</h2>
                        <p className="text-sm text-subtle">{stock.name}</p>
                    </div>
                    <button onClick={onClose} className="p-2 rounded-full hover:bg-overlay transition-colors" aria-label="Close modal">
                       <CloseIcon />
                    </button>
                </header>

                <main className="p-6 flex-grow overflow-y-auto">
                    <section>
                        <h3 className="text-lg font-semibold text-subtle mb-4">VCP Chart Simulation</h3>
                        <div className="h-64 w-full">
                           <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                                    <XAxis dataKey="name" stroke="#9ca3af" />
                                    <YAxis stroke="#9ca3af" />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#1f2937',
                                            borderColor: '#374151',
                                            color: '#f9fafb'
                                        }}
                                    />
                                    <Line type="monotone" dataKey="price" stroke="#3b82f6" strokeWidth={2} yAxisId={0} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </section>
                    
                    <section className="mt-6">
                         <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-subtle">AI-Powered Analysis</h3>
                            <button 
                                onClick={handleGenerateAnalysis}
                                disabled={isLoading}
                                className="px-4 py-2 text-sm font-medium bg-primary text-text rounded-lg shadow hover:bg-primary-focus focus:outline-none focus:ring-2 focus:ring-primary-focus disabled:bg-muted disabled:cursor-not-allowed flex items-center gap-2"
                            >
                               {isLoading && <LoadingIcon />}
                               {isLoading ? 'Generating...' : analysis ? 'Regenerate' : 'Generate Analysis'}
                            </button>
                        </div>
                        <div className="mt-4 p-4 bg-overlay rounded-lg min-h-[100px] text-subtle text-sm leading-relaxed">
                            {isLoading && <p className="text-center animate-pulse">Fetching insights from Gemini...</p>}
                            {error && <p className="text-negative text-center">{error}</p>}
                            {analysis && <p dangerouslySetInnerHTML={{ __html: formattedAnalysis }}></p>}
                            {!analysis && !isLoading && !error && <p>Click "Generate Analysis" to get AI-powered insights on this VCP setup.</p>}
                        </div>
                    </section>

                </main>
            </div>
        </div>
    );
};