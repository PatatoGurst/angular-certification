import { CompanyApi } from './company-api';

export interface CompanyResultApi {
  /** Number of results. */
  count: number;
  /** Array of search results. */
  companies: CompanyApi[];
}
