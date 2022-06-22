import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Stock } from '../stock';
import { StockService } from '../stock.service';

@Component({
  templateUrl: './stock-search.component.html',
  styleUrls: ['./stock-search.component.css'],
})
export class StockSearchConponent implements OnInit {
  symbolInput: string;
  private symbolList: string[];
  stocks: Stock;
  mouseOverSumbit: boolean;
  stockForm: FormGroup;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.symbolList = [];
    let symbol = new FormControl('', Validators.required);
    this.stockForm = new FormGroup({
      symbol: symbol,
    });
    //this.stocks$ = this.stockService.getStockSummaries(this.symbolList);
  }

  onSubmit(form: NgForm) {
    if (!this.symbolList.find((s) => s == this.symbolInput)) {
      this.symbolList.push(this.symbolInput);
    }
    console.log(this.symbolList);
  }
}
