import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { StockDetail } from '../../model/stock-detail';
import { StockService } from '../stock.service';

@Component({
  templateUrl: './stock-details.component.html',
})
export class StockDetailsComponent implements OnInit, OnDestroy {
  stock: StockDetail;

  subscriptions: Subscription[] = [];

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    //this.subscription.push(this.stockService.getStockDetail(this.route.snapshot.params['symbol']));
    this.stock = {
      symbol: this.route.snapshot.params['symbol'],
      companyName: 'LALALA',
      currentPrice: 1,
      change: 2,
      percentChange: 3,
      highPriceDay: 4,
      lowPriceDay: 5,
      openPriceDay: 6,
      previousClosePrice: 7,
    };
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
