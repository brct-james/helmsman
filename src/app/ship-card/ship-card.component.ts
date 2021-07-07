import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-ship-card',
  templateUrl: './ship-card.component.html',
  styleUrls: ['./ship-card.component.sass'],
})
export class ShipCardComponent implements OnInit {
  constructor() {}

  @Input() shipInfo: any;
  @Input() tRemShipStatus: any;

  ngOnInit(): void {}

  getShipFuel(cargo: any): number {
    let res = cargo.filter((obj) => {
      return obj.good === 'FUEL';
    });
    return res[0] ? res[0].quantity : 0;
  }

  getManufacturerLogoPath(manufacturer: string): string {
    let res = 'assets/images/manufacturer_logos/';
    res += manufacturer.toLowerCase() + '.svg';
    return res;
  }
}
