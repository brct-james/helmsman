import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'abbrNum',
})
export class AbbrNumPipe implements PipeTransform {
  transform(num: number): string {
    if (num && typeof num === 'number') {
      let res = '';
      let powerOfTen = Number.parseInt(num.toExponential().split('e')[1]);
      if (powerOfTen < 6) {
        //0 - 999,999
        res = num.toLocaleString('en-US', { maximumFractionDigits: 0 });
      } else if (powerOfTen < 9) {
        //1.00m - 999.99m
        res = (num / Math.pow(10, powerOfTen)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'm';
      } else if (powerOfTen < 12) {
        //1.00b - 999.99b
        res = (num / Math.pow(10, powerOfTen)).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + 'b';
      } else {
        res = num.toExponential().toString();
      }
      return res;
    } else {
      return num.toString();
    }
  }
}
