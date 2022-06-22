import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Stock } from '../../model/stock';
import { StockService } from '../stock.service';
import { dupplicatedSymbol } from './dupplicated-symbol.validator';

@Component({
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.css'],
})
export class StockSearchConponent implements OnInit {
  private symbolList: string[];
  stocks: Stock[];
  stockForm: FormGroup;
  symbolInputForm: FormControl;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.symbolList = JSON.parse(localStorage.getItem('symbol-list')) || [];
    this.symbolInputForm = new FormControl('', [
      Validators.required,
      Validators.maxLength(5),
      dupplicatedSymbol(this.symbolList),
    ]);
    this.stockForm = new FormGroup({
      symbol: this.symbolInputForm,
    });
    //this.stocks = this.stockService.getStockSummaries(this.symbolList);
  }

  getStock(symbolInput: string) {
    if (this.stockForm.valid) {
      console.log(symbolInput);
      if (!this.symbolList.find((s) => s == symbolInput)) {
        this.symbolList.push(symbolInput);
        localStorage.setItem('symbol-list', JSON.stringify(this.symbolList));
        this.stockForm.reset();
        let sub = this.stockService
          .getStockDetail(symbolInput)
          .subscribe((stock) => {
            this.stocks.push(stock);
            console.log(stock);
          });
      }
    }
  }

  removeStockTrack(symbolInput: string) {
    this.symbolList = this.symbolList.filter((s) => s == symbolInput);
    localStorage.setItem('symbol-list', JSON.stringify(this.symbolList));
  }
}
