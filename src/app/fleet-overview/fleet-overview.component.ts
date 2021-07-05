import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IntervalService } from '../interval.service';

@Component({
  selector: 'app-fleet-overview',
  templateUrl: './fleet-overview.component.html',
  styleUrls: ['./fleet-overview.component.sass'],
})
export class FleetOverviewComponent implements OnInit {
  /*
  cargo[{good:"", quantity:0, totalVolume, 0}]
  */

  fleetArray: any[] = [];
  constructor(public api: ApiService, public intervals: IntervalService) {}

  get timeRemainingGetFleetStatus() {
    if (this.intervals.timeRemainingTillCall['getFleetStatus'] === undefined) {
      return 0;
    }
    return Math.ceil(this.intervals.timeRemainingTillCall['getFleetStatus'].valueOf() / 1000);
  }

  ngOnInit(): void {
    this.intervals.new('getFleetStatus', this.updateFleetInfo.bind(this), 10 * 1000);
    this.updateFleetInfo();
  }

  updateFleetInfo(): void {
    this.api.getAllShips(
      function (shipData) {
        this.fleetArray = shipData;
      }.bind(this)
    );
  }
}
