import { Component, OnInit } from '@angular/core';
import { IntervalService } from '../../interval.service';
import { SettingService } from '../../setting.service';

@Component({
  selector: 'app-fleet-settings',
  templateUrl: './fleet-settings.component.html',
  styleUrls: ['./fleet-settings.component.sass'],
})
export class FleetSettingsComponent implements OnInit {
  fleetUpdateToggle: boolean = true;
  fleetUpdateInterval: number = 10;

  constructor(private settings: SettingService, private intervals: IntervalService) {}

  ngOnInit(): void {
    this.fleetUpdateToggle = this.settings.fleetUpdateToggle;
    this.fleetUpdateInterval = this.settings.fleetUpdateInterval;

    //Subscribe to this value so all settings pages are synchronized no matter what
    //Disabled as I'm not convinced I'm supporting use cases where this matters
    // this.settings.setObserve(
    //   'settings-fleetUpdateToggle',
    //   function (value: any) {
    //     console.log('fut', value);
    //     this.fleetUpdateToggle = value;
    //   }.bind(this)
    // );
  }

  fleetUpdateToggleChanged() {
    this.settings.fleetUpdateToggle = this.fleetUpdateToggle;
    this.intervals.toggleInterval('getFleetStatus', this.fleetUpdateToggle);
  }
  fleetUpdateIntervalChanged() {
    this.settings.fleetUpdateInterval = this.fleetUpdateInterval;
    this.intervals.updateInterval('getFleetStatus', this.fleetUpdateInterval);
  }
}
