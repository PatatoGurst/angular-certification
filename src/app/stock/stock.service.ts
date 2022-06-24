import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { CompanyApi } from '../model/company-api';
import { CompanyResultApi } from '../model/company-result-api';
import { Stock } from '../model/stock';
import { StockApi } from '../model/stock-api';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class StockService {
  private apiQuoteBaseUrl: string = 'https://finnhub.io/api/v1/quote';
  private apiCompanyBaseUrl: string = 'https://finnhub.io/api/v1/search';
  private token = 'bu4f8kn48v6uehqi3cqg';
  private stockSource: BehaviorSubject<Stock[]> = new BehaviorSubject<Stock[]>(
    []
  );
  stockObservable$: Observable<Stock[]> = this.stockSource.asObservable();
  private pendingCalls: string[] = [];

  constructor(private httpClient: HttpClient, private toastr: ToastrService) {}

  private getStockDetailObservable(stockSymbol: string): Observable<Stock> {
    if (!this.pendingCalls.find((s) => s == stockSymbol)) {
      this.pendingCalls.push(stockSymbol);
    }
    let apiQuoteUrl = `${this.apiQuoteBaseUrl}?symbol=${stockSymbol}&token=${this.token}`;
    let stockApi$: Observable<StockApi> =
      this.httpClient.get<StockApi>(apiQuoteUrl);

    let apiCompanyUrl = `${this.apiCompanyBaseUrl}?q=${stockSymbol}&token=${this.token}`;
    let companyName$: Observable<string> = this.httpClient
      .get<CompanyResultApi>(apiCompanyUrl)
      .pipe(map((result) => this.getCompanyFromApiResult(stockSymbol, result)));

    return combineLatest([stockApi$, companyName$]).pipe(
      map(([stock, name]) =>
        this.mapStockApiCompanyApiToStock(stock, name, stockSymbol)
      )
    );
  }

  addStock(stockSymbol: string, symbolList: string[]): void {
    this.getStockDetailObservable(stockSymbol).subscribe((stock) => {
      this.addStockOrReturnError(stock, symbolList);
    });
  }

  getStockSummaries(symbols: string[]): void {
    of(...symbols)
      .pipe(concatMap((symbol) => this.getStockDetailObservable(symbol)))
      .subscribe((stock) => {
        this.addStockOrReturnError(stock, symbols);
      });
  }

  removeStockTrack(symbol: string): void {
    let currentStocks = this.stockSource.getValue();
    currentStocks = currentStocks.filter((s) => s.symbol != symbol);
    this.stockSource.next(currentStocks);
  }

  getPendingCalls(): string[] {
    return this.pendingCalls;
  }

  private addStockOrReturnError(stock: Stock, symbolList: string[]): void {
    this.pendingCalls = this.pendingCalls.filter((s) => s != stock.symbol);
    let currentStocks = this.stockSource.getValue();
    if (stock.currentPrice && stock.companyName) {
      currentStocks = currentStocks.concat(stock);
      this.stockSource.next(currentStocks);
    } else {
      this.toastr.error(
        `The symbol ${stock.symbol} does not correspond to a stock`
      );
      this.removeStockTrack(stock.symbol);
      const symbolIndex = symbolList.findIndex((s) => s == stock.symbol);
      if (symbolIndex != -1) {
        symbolList.splice(symbolIndex, 1);
        localStorage.setItem('symbol-list', JSON.stringify(symbolList));
      }
    }
  }

  private getCompanyFromApiResult(
    symbol: string,
    companyResult: CompanyResultApi
  ): string {
    let companyName = '';
    if (companyResult && companyResult.result) {
      let companies: CompanyApi[] = companyResult.result;
      let symbolMatch = companies.find((c) => c.symbol == symbol);
      if (symbolMatch) {
        companyName = symbolMatch.description;
      }
    }
    return companyName;
  }

  /**
   * Maps a Stock object from external API to an internal Stock object
   */
  private mapStockApiCompanyApiToStock(
    stockApi: StockApi,
    name,
    symbol
  ): Stock {
    return {
      symbol: symbol,
      companyName: name,
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
