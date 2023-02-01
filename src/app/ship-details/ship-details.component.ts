import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ship } from 'spacetraders-v2-ng';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-ship-details',
  templateUrl: './ship-details.component.html',
  styleUrls: ['./ship-details.component.sass'],
})
export class ShipDetailsComponent implements OnInit {
  symbol: string = '';
  ship: Ship | undefined;

  constructor(private route: ActivatedRoute, public api: ApiService) {
    this.updateFleetInfo();
  }

  ngOnInit(): void {
    let symbol = this.route.snapshot.paramMap.get('symbol');
    this.symbol = symbol == null ? '' : symbol;
  }

  async updateFleetInfo(): Promise<void> {
    await this.api.getAllShips();
    let fleet = this.api.retrieveLocally('fleet').ships;
    this.ship = fleet.filter((s: Ship) => s.symbol == this.symbol)[0];
  }
}
