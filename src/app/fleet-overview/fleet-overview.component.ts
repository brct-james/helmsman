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
      function () {
        this.api.getAllShips(
          function (shipData) {
            this.fleetArray = shipData;
          }.bind(this)
        );
      }.bind(this),
      10 * 1000
    );
  }
}
