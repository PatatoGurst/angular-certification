import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stock } from '../../model/stock';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.css'],
})
export class StockSummaryComponent {
  @Input() stock: Stock;
  @Output() remove: EventEmitter<string> = new EventEmitter<string>();

  removeTrack() {
    this.remove.emit(this.stock.symbol);
  }
}
