import { FormControl } from '@angular/forms';

export function dupplicatedSymbol(symbols: string[]) {
  return (control: FormControl): { [key: string]: boolean } => {
    return symbols.find((s) => s == control.value)
      ? {
          dupplicatedSymbol: true,
        }
      : null;
  };
}
