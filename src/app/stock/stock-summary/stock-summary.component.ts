import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Stock } from '../../model/stock';
import {
  faArrowUp,
  faArrowDown,
  faEquals,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'stock-summary',
  templateUrl: './stock-summary.component.html',
  styleUrls: ['./stock-summary.component.css'],
})
export class StockSummaryComponent {
  @Input() stock: Stock;
  @Output() remove: EventEmitter<string> = new EventEmitter<string>();

  arrowUp = faArrowUp;
  arrowDown = faArrowDown;
  equals = faEquals;

  removeTrack() {
    this.remove.emit(this.stock.symbol);
  }
}
