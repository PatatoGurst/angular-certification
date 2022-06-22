import { Component, Input } from '@angular/core';
import { Stock } from '../../model/stock';

@Component({
  selector: 'stock-summary',
  templateUrl: './stock-summary.component.html',
})
export class StockSummaryComponent {
  @Input() stock: Stock;
}
