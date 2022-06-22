import { StockDetailsComponent } from './stock/stock-details/stock-details.component';
import { StockSearchConponent } from './stock/stock-search/stock-search.component';

export const stockAppRoutes = [
  { path: 'stocks/search', component: StockSearchConponent },
  { path: 'sentiment/:symbol', component: StockDetailsComponent },
];
