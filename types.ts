export type Exchange = 'NSE' | 'BSE' | 'ALL';
export type MarketCap = 'Large' | 'Mid' | 'Small' | 'ALL';

export interface ScanFilters {
  exchange: Exchange;
  marketCap: MarketCap;
}

export interface Stock {
  symbol: string;
  name: string;
  exchange: 'NSE' | 'BSE';
  marketCap: 'Large' | 'Mid' | 'Small';
}
