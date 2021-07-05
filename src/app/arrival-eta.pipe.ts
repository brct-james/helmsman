import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'arrivalEta',
})
export class ArrivalEtaPipe implements PipeTransform {
  transform(arrivesAt: string, refreshParameter: any): string {
    let arrivesAtDate = new Date(arrivesAt).valueOf();
    let now = Date.now();
    let eta = Math.floor((arrivesAtDate - now) / 1000);
    return eta <= 0 ? 'Arrived' : eta.toString() + 's';
  }
}
