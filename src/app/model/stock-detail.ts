import { InsiderSentiment } from './insider-sentiment';

export class StockDetail {
  symbol: string;
  companyName: string;
  insiderSentiments: InsiderSentiment[];
}
