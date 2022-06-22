import { Component } from '@angular/core';
import { Stock } from '../stock';
import { StockService } from '../stock.service';

@Component({
  templateUrl: './stock-details.component.html',
})
export class StockDetailsComponent {
  stock: Stock;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.stock = this.stockService.getStockDetail('TOTO');
  }
}
