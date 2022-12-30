import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ship-card',
  templateUrl: './ship-card.component.html',
  styleUrls: ['./ship-card.component.sass']
})
export class ShipCardComponent {
  @Input() shipInfo: any;
  @Input() tRemShipStatus: any;

  ngOnInit(): void {}

  getShipAntimatter(cargo: Good[]): number {
    let res = cargo.filter((obj: Good) => {
      return obj.symbol === 'ANTIMATTER';
    });
    return res[0] ? res[0].units : 0;
  }

  getManufacturerLogoPath(manufacturer: string): string {
    let res = 'assets/images/manufacturer_logos/';
    res += manufacturer.toLowerCase() + '.svg';
    return res;
  }
}

interface Good {
  symbol: string,
  name: string,
  units: number,
  description: string
}