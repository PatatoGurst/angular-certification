export interface Stock {
  symbol: string;
  companyName: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  highPriceDay: number;
  lowPriceDay: number;
  openPriceDay: number;
  previousClosePrice: number;
}
