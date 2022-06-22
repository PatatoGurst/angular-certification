import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { concatMap } from 'rxjs/operators';
import { Stock } from './stock';
import { StockApi } from './stock-api';

@Injectable()
export class StockService {
  private apiQuoteBaseUrl: string = 'https://finnhub.io/api/v1/quote';
  private token = 'bu4f8kn48v6uehqi3cqg';

  constructor(private httpClient: HttpClient) {}

  getStockDetail(stockSymbol: string): Observable<Stock> {
    let apiQuoteUrl = `${this.apiQuoteBaseUrl}?symbol=${stockSymbol}&token=${this.token}`;
    return this.httpClient
      .get(apiQuoteUrl)
      .pipe(
        map((stock: StockApi) => this.mapStockApiToStock(stock, stockSymbol))
      );
  }

  getStockSummaries(symbols: string[]): Observable<Stock> {
    return of(...symbols).pipe(
      concatMap((symbol) => this.getStockDetail(symbol))
    );
  }

  /**
   * Maps a Stock object from external API to an internal Stock object
   */
  private mapStockApiToStock(stockApi: StockApi, symbol): Stock {
    return {
      symbol: symbol,
      currentPrice: stockApi.c,
      change: stockApi.d,
      percentChange: stockApi.dp,
      highPriceDay: stockApi.h,
      lowPriceDay: stockApi.l,
      openPriceDay: stockApi.o,
      previousClosePrice: stockApi.pc,
    };
  }
}
