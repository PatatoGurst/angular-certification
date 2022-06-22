import { Injectable } from '@angular/core';
import { Stock } from './stock';

@Injectable()
export class StockService {
  getStockDetail(stockSymbol: string): Stock {
    return { name: stockSymbol };
  }
}
