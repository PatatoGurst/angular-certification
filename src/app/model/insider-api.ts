import { InsiderSentimentApi } from './insider-sentiment-api';

export interface InsiderApi {
  /** Array of sentiment data. */
  data: InsiderSentimentApi[];
  /** Symbol of the company. */
  symbol: string;
}
