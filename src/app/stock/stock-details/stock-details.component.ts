import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { StockDetail } from '../../model/stock-detail';
import { StockService } from '../stock.service';
import { ToastrService } from 'ngx-toastr';
import {
  faArrowUp,
  faArrowDown,
  faEquals,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  templateUrl: './stock-details.component.html',
  styleUrls: ['./stock-details.component.css'],
})
export class StockDetailsComponent implements OnInit, OnDestroy {
  stock: StockDetail;
  loading: boolean;
  subscriptions: Subscription[] = [];
  arrowUp = faArrowUp;
  arrowDown = faArrowDown;
  equals = faEquals;

  constructor(
    private stockService: StockService,
    private route: ActivatedRoute,
    private toastr: ToastrService
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
        .subscribe({
          next: (s) => {
            if (!s.companyName) {
              this.toastr.error('No data found for the requested symbol');
            }
            this.loading = false;
            return (this.stock = s);
          },
          error: (e) => {
            console.log(e);
            this.loading = false;
            this.toastr.error(
              'An error was raised while retrieving data from the server. Please try again later or check the spelling of your symbol'
            );
            this.toastr.error(`Error encountered : ${e}`);
          },
        })
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }
}
