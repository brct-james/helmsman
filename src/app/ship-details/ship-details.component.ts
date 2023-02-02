import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ship } from 'spacetraders-v2-ng';
import { ApiService } from '../api.service';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-ship-details',
  templateUrl: './ship-details.component.html',
  styleUrls: ['./ship-details.component.sass'],
})
export class ShipDetailsComponent implements OnInit {
  symbol: string = '';
  ship: Ship | undefined;

  constructor(
    private route: ActivatedRoute,
    public api: ApiService,
    public storage: StorageService
  ) {
    this.updateFleetInfo();
  }

  ngOnInit(): void {
    let symbol = this.route.snapshot.paramMap.get('symbol');
    this.symbol = symbol == undefined ? '' : symbol;
  }

  async updateFleetInfo(): Promise<void> {
    await this.api.getAllShips();
    let retrieved = this.storage.retrieve('fleet');
    if (retrieved == undefined) {
      this.ship = undefined;
    } else {
      let fleet = retrieved.data;
      this.ship = fleet.get(this.symbol);
    }
  }
}
