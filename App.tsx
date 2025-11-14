import React, { useState, useCallback, useMemo } from 'react';
import { Header } from './components/Header.js';
import { getStocks } from './services/scannerService.js';
import { getVcpCandidates } from './services/precomputedResultsService.js';
import type { ScanFilters, Stock } from './types';
import { ScanFilters as ScanFiltersComponent } from './components/ScanFilters.js';
import { StockList } from './components/StockList.js';

const App: React.FC = () => {
  const [scanResults, setScanResults] = useState<Stock[]>([]);
  const [hasScanned, setHasScanned] = useState<boolean>(false);

  const allStocks = useMemo(() => getStocks(), []);
  const vcpCandidateSymbols = useMemo(() => new Set(getVcpCandidates()), []);

  const vcpStocks = useMemo(() => {
    return allStocks.filter(stock => vcpCandidateSymbols.has(stock.symbol));
  }, [allStocks, vcpCandidateSymbols]);


  const handleScan = useCallback((filters: ScanFilters) => {
    setHasScanned(true);

    const results = vcpStocks.filter(stock => {
      const exchangeMatch = filters.exchange === 'ALL' || stock.exchange === filters.exchange;
      const marketCapMatch = filters.marketCap === 'ALL' || stock.marketCap === filters.marketCap;
      return exchangeMatch && marketCapMatch;
    });

    setScanResults(results);
  }, [vcpStocks]);

  return (
    <div className="min-h-screen bg-base font-sans flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-text mb-2">
            AI-Powered VCP Stock Screener
          </h2>
          <p className="text-subtle max-w-3xl mx-auto">
            Instantly filter our pre-analyzed list of VCP candidates from a database of over 450 NSE/BSE stocks. The results reflect a comprehensive daily scan.
          </p>
        </div>

        <ScanFiltersComponent onScan={handleScan} />

        <div className="flex-grow mt-8">
          {hasScanned && scanResults.length === 0 && (
             <div className="h-full flex flex-col items-center justify-center text-center text-muted p-8 bg-surface rounded-xl shadow-inner">
               <div className="text-5xl mb-4">😕</div>
              <p className="mt-4 text-lg font-semibold">No VCP Patterns Found</p>
              <p className="text-sm text-subtle max-w-sm">No pre-analyzed VCP candidates match your filter criteria. Try adjusting the filters.</p>
            </div>
          )}

          {scanResults.length > 0 && (
            <StockList stocks={scanResults} />
          )}
          
          {!hasScanned && (
             <div className="h-full flex flex-col items-center justify-center text-center text-muted p-8 bg-surface rounded-xl shadow-inner">
               <div className="text-5xl mb-4">🔎</div>
              <p className="mt-4 text-lg font-semibold">Ready to Screen</p>
              <p className="text-sm text-subtle max-w-sm">Choose your filters and press "Apply Filters" to see the results.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="text-center p-4 text-muted text-sm">
        <p>Disclaimer: This is an educational tool for analyzing market patterns. Not financial advice.</p>
      </footer>
    </div>
  );
};

export default App;