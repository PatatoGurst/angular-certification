import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Stock } from '../stock';
import { StockService } from '../stock.service';

@Component({
  templateUrl: './stock-details.component.html',
})
export class StockDetailsComponent {
  stock: Stock;

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.stock = {
      symbol: this.route.snapshot.params['symbol'],
      currentPrice: 1,
      change: 2,
      percentChange: 3,
      highPriceDay: 4,
      lowPriceDay: 5,
      openPriceDay: 6,
      previousClosePrice: 7,
    };
  }
}
