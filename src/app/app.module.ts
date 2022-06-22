import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StockAppComponent } from './stock-app.component';
import { StockSearchConponent } from './stock/stock-search/stock-search.component';
import { StockDetailsComponent } from './stock/stock-details/stock-details.component';
import { StockService } from './stock/stock.service';
import { stockAppRoutes } from './routes';
import { StockSummaryComponent } from './stock/stock-summary/stock-summary.component';

@NgModule({
  imports: [BrowserModule, FormsModule, RouterModule.forRoot(stockAppRoutes)],
  declarations: [
    StockAppComponent,
    StockSearchConponent,
    StockDetailsComponent,
    StockSummaryComponent,
  ],
  providers: [StockService],
  bootstrap: [StockAppComponent],
})
export class AppModule {}
