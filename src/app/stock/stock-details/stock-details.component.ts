import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StockDetail } from '../../model/stock-detail';
import { StockService } from '../stock.service';
import {
  faArrowUp,
  faArrowDown,
  faEquals,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './stock-details.component.html',
})
export class StockDetailsComponent implements OnInit, OnDestroy {
  stock: StockDetail;
  loading: boolean;
  subscriptions: Subscription[] = [];
  

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    let today: Date = new Date();
    let dateTo = today.toISOString().split('T')[0];
    today.setMonth(today.getMonth() - 2);
    let dateFrom = today.toISOString().split('T')[0];
    this.loading = true;
    this.subscriptions.push(
      this.stockService
        .getStockDetail(this.route.snapshot.params['symbol'], dateFrom, dateTo)
        .subscribe(
          (s) => {
            this.loading = false;
            return (this.stock = s);
          },
          (e) => {
            this.loading = false;
          }
        )
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
