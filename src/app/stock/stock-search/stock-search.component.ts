import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Stock } from '../stock';
import { StockService } from '../stock.service';
import { dupplicatedSymbol } from './dupplicated-symbol.validator';

@Component({
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.css'],
})
export class StockSearchConponent implements OnInit {
  private symbolList: string[];
  stocks: Stock;
  mouseOverSumbit: boolean;
  stockForm: FormGroup;
  symbolInputForm: FormControl;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.symbolList = [];
    this.symbolInputForm = new FormControl('', [
      Validators.required,
      Validators.maxLength(5),
      dupplicatedSymbol(this.symbolList),
    ]);
    this.stockForm = new FormGroup({
      symbol: this.symbolInputForm,
    });
    //this.stocks$ = this.stockService.getStockSummaries(this.symbolList);
  }

  getStock(symbolInput: string) {
    if (this.stockForm.valid) {
      console.log(symbolInput);
      if (!this.symbolList.find((s) => s == symbolInput)) {
        this.symbolList.push(symbolInput);
        this.stockForm.reset();
      }
      console.log(this.symbolList);
    }
  }
}
