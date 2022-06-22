export interface CompanyApi {
  /** Symbol description. */
  description: string;
  /** Display symbol name. */
  displaySymbol: string;
  /** Unique symbol used to identify this symbol used in /stock/candle endpoint. */
  symbol: string;
  /** Security type. */
  type: string;
}
