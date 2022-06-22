import { Routes } from '@angular/router';
import { StockDetailsComponent } from './stock/stock-details/stock-details.component';
import { StockSearchConponent } from './stock/stock-search/stock-search.component';

export const stockAppRoutes: Routes = [
  { path: 'stocks', component: StockSearchConponent },
  { path: 'sentiment/:symbol', component: StockDetailsComponent },
  { path: '', redirectTo: '/stocks', pathMatch: 'full' },
];
