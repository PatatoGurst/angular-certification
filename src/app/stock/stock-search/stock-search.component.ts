import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Stock } from '../stock';
import { StockService } from '../stock.service';

@Component({
  templateUrl: './stock-search.component.html',
})
export class StockSearchConponent implements OnInit {
  private symbolList: string[];
  stocks$: Observable<Stock>;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    //this.stocks$ = this.stockService.getStockSummaries(this.symbolList);
  }
}
