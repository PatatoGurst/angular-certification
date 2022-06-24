export interface InsiderSentimentApi {
  /** Net buying/selling from all insiders' transactions. */
  change: number;
  /** Month. */
  month: number;
  /** Monthly share purchase ratio. */
  mspr: number;
  /** Symbol. */
  symbol: string;
  /** Year. */
  year: number;
}
