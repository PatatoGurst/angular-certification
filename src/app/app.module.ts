import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { StockAppComponent } from './stock-app.component';
import { StockSearchConponent } from './stock/stock-search/stock-search.component';
import { StockDetailsComponent } from './stock/stock-details/stock-details.component';
import { StockService } from './stock/stock.service';
import { stockAppRoutes } from './routes';
import { StockSummaryComponent } from './stock/stock-summary/stock-summary.component';
import { HttpClientModule } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forRoot(stockAppRoutes),
    ToastrModule.forRoot(),
    HttpClientModule,
    BrowserAnimationsModule,
    FontAwesomeModule,
  ],
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
