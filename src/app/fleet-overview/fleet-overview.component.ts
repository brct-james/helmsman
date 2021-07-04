import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { IntervalService } from '../interval.service';

@Component({
  selector: 'app-fleet-overview',
  templateUrl: './fleet-overview.component.html',
  styleUrls: ['./fleet-overview.component.sass'],
})
export class FleetOverviewComponent implements OnInit {
  fleetArray: any[] = [];

  constructor(public api: ApiService, public intervals: IntervalService) {}

  ngOnInit(): void {
    this.intervals.new(
      'getFleetStatus',
      //TODO: Make sure this is working still after changing it from an anon func
      this.updateFleetInfo.bind(this),
      10 * 1000
    );
    this.updateFleetInfo();
  }

  updateFleetInfo(): void {
    this.api.getAllShips(
      function (shipData) {
        this.fleetArray = shipData;
        console.log(this.fleetArray);
      }.bind(this)
    );
  }
}
