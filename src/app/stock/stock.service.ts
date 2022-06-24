import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, of } from 'rxjs';
import { mergeMap } from 'rxjs/operators';
import { CompanyApi } from '../model/company-api';
import { CompanyResultApi } from '../model/company-result-api';
import { Stock } from '../model/stock';
import { StockApi } from '../model/stock-api';
import { InsiderApi } from '../model/insider-api';
import { StockDetail } from '../model/stock-detail';
import { ToastrService } from 'ngx-toastr';
import { InsiderSentiment } from '../model/insider-sentiment';

@Injectable()
export class StockService {
  private apiQuoteBaseUrl: string = 'https://finnhub.io/api/v1/quote';
  private apiCompanyBaseUrl: string = 'https://finnhub.io/api/v1/search';
  private apiInsiderBaseUrl: string =
    'https://finnhub.io/api/v1/stock/insider-sentiment';
  private MONTHS: string[] = [
    'JANUARY',
    'FEBRUARY',
    'MARCH',
    'APRIL',
    'MAY',
    'JUNE',
    'JULY',
    'AUGUST',
    'SEPTEMBER',
    'OCTOBER',
    'NOVEMBER',
    'DECEMBER',
  ];
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
    let stockApi$: Observable<StockApi> =
      this.getStockApiObservable(stockSymbol);
    let companyName$: Observable<string> =
      this.getCompanyResultApiObservable(stockSymbol);

    return combineLatest([stockApi$, companyName$]).pipe(
      map(([stock, name]) =>
        this.mapStockApiCompanyApiToStock(stock, name, stockSymbol)
      )
    );
  }

  private getStockApiObservable(stockSymbol: string): Observable<StockApi> {
    let apiQuoteUrl = `${this.apiQuoteBaseUrl}?symbol=${stockSymbol}&token=${this.token}`;
    return this.httpClient.get<StockApi>(apiQuoteUrl);
  }

  private getCompanyResultApiObservable(
    stockSymbol: string
  ): Observable<string> {
    let apiCompanyUrl = `${this.apiCompanyBaseUrl}?q=${stockSymbol}&token=${this.token}`;
    return this.httpClient
      .get<CompanyResultApi>(apiCompanyUrl)
      .pipe(map((result) => this.getCompanyFromApiResult(stockSymbol, result)));
  }

  private getInsiderApiObservable(
    stockSymbol: string,
    dateFrom: string,
    dateTo: string
  ): Observable<InsiderApi> {
    let apiInsiderUrl = `${this.apiInsiderBaseUrl}?symbol=${stockSymbol}&from=${dateFrom}&to=${dateTo}&token=${this.token}`;
    return this.httpClient.get<InsiderApi>(apiInsiderUrl);
  }

  getStockDetail(
    stockSymbol: string,
    dateFrom: string,
    dateTo: string
  ): Observable<StockDetail> {
    let companyName$: Observable<string> =
      this.getCompanyResultApiObservable(stockSymbol);
    let stockInsider$: Observable<InsiderApi> = this.getInsiderApiObservable(
      stockSymbol,
      dateFrom,
      dateTo
    );
    return combineLatest([companyName$, stockInsider$]).pipe(
      map(([name, insider]) =>
        this.mapToStockDetail(name, insider, stockSymbol)
      )
    );
  }

  addStock(stockSymbol: string, symbolList: string[]): void {
    this.getStockDetailObservable(stockSymbol).subscribe((stock) => {
      this.addStockOrReturnError(stock, symbolList);
    });
  }

  getStockSummaries(symbols: string[]): void {
    let currentValues = this.stockSource.getValue();
    if (currentValues.length == 0) {
      of(...symbols)
        .pipe(mergeMap((symbol) => this.getStockDetailObservable(symbol)))
        .subscribe((stock) => {
          this.addStockOrReturnError(stock, symbols);
        });
    }
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
    name: string,
    symbol: string
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

  private mapToStockDetail(
    name: string,
    insider: InsiderApi,
    symbol: string
  ): StockDetail {
    return {
      symbol: symbol,
      companyName: name,
      insiderSentiments: this.mapToInsiderSentiment(insider),
    };
  }

  private mapToInsiderSentiment(insider: InsiderApi): InsiderSentiment[] {
    let insiderSentiments: InsiderSentiment[] = [];
    if (insider?.data) {
      insiderSentiments = insider.data.map((d) => ({
        month: this.MONTHS[(d.month + 11) % 12],
        change: d.change,
        mspr: d.mspr,
      }));
    }
    return insiderSentiments;
  }
}
