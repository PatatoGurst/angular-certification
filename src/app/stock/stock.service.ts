import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { combineLatest, forkJoin, map, Observable, of } from 'rxjs';
import { concatMap, tap } from 'rxjs/operators';
import { CompanyApi } from '../model/company-api';
import { CompanyResultApi } from '../model/company-result-api';
import { Stock } from '../model/stock';
import { StockApi } from '../model/stock-api';

@Injectable()
export class StockService {
  private apiQuoteBaseUrl: string = 'https://finnhub.io/api/v1/quote';
  private apiCompanyBaseUrl: string = 'https://finnhub.io/api/v1/search';
  private token = 'bu4f8kn48v6uehqi3cqg';
  stockList: Stock[] = [];

  constructor(private httpClient: HttpClient) {}

  getStockDetail(stockSymbol: string): Observable<Stock> {
    let apiQuoteUrl = `${this.apiQuoteBaseUrl}?symbol=${stockSymbol}&token=${this.token}`;
    console.log(apiQuoteUrl);
    let stockApi$: Observable<StockApi> =
      this.httpClient.get<StockApi>(apiQuoteUrl);

    let apiCompanyUrl = `${this.apiCompanyBaseUrl}?q=${stockSymbol}&token=${this.token}`;
    console.log(apiCompanyUrl);
    let companyName$: Observable<string> = this.httpClient
      .get<CompanyResultApi>(apiCompanyUrl)
      .pipe(map((result) => this.getCompany(stockSymbol, result)));

    return combineLatest([stockApi$, companyName$]).pipe(
      map(([stock, name]) =>
        this.mapStockApiCompanyApiToStock(stock, name, stockSymbol)
      )
    );
  }

  getStockSummaries(symbols: string[]): Observable<Stock> {
    return of(...symbols).pipe(
      concatMap((symbol) => this.getStockDetail(symbol))
    );
  }

  private getCompany(symbol: string, companyResult: CompanyResultApi): string {
    let companyName = '';
    if (companyResult && companyResult.companies) {
      let companies: CompanyApi[] = companyResult.companies;
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
