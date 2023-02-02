import { Component } from '@angular/core';
import { ApiService } from '../api.service';
import { IntervalService } from '../interval.service';
import { SettingService } from '../setting.service';
import { Ship } from 'spacetraders-v2-ng';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-fleet-overview',
  templateUrl: './fleet-overview.component.html',
  styleUrls: ['./fleet-overview.component.sass'],
})
export class FleetOverviewComponent {
  fleetArray: Ship[] = [];

  constructor(
    public api: ApiService,
    public intervals: IntervalService,
    private settings: SettingService,
    public storage: StorageService
  ) {}

  get timeRemainingGetFleetStatus() {
    if (this.intervals.timeRemainingTillCall['getFleetStatus'] === undefined) {
      return 0;
    }
    return Math.ceil(
      this.intervals.timeRemainingTillCall['getFleetStatus'].valueOf() / 1000
    );
  }

  // get fleetArray() {
  //   let arr: object[] = this.storage.retrieve("fleet").ships;
  //   return arr;
  // }

  ngOnInit(): void {
    this.intervals.new(
      'getFleetStatus',
      this.updateFleetInfo.bind(this),
      this.settings.fleetUpdateInterval * 1000,
      this.settings.fleetUpdateToggle
    );
    this.updateFleetInfo();
  }

  async updateFleetInfo(): Promise<void> {
    await this.api.getAllShips();
    let retrieved = this.storage.retrieve('fleet');
    this.fleetArray =
      retrieved == undefined ? [] : [...retrieved.data.values()];
  }
}
