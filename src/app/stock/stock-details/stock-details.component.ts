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
    let today: Date = new Date();
    let dateTo = today.toISOString().split('T')[0];
    today.setMonth(today.getMonth() - 3);
    let dateFrom = today.toISOString().split('T')[0];
    this.subscriptions.push(
      this.stockService
        .getStockDetail(this.route.snapshot.params['symbol'], dateFrom, dateTo)
        .subscribe((s) => (this.stock = s))
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
