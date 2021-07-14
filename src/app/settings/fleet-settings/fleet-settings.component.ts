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

  constructor(private settings: SettingService, private intervals: IntervalService) {}

  ngOnInit(): void {
    this.fleetUpdateToggle = this.settings.fleetUpdateToggle;

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

  fleetUpdateChanged() {
    this.settings.fleetUpdateToggle = this.fleetUpdateToggle;
    this.intervals.toggleInterval('getFleetStatus', this.fleetUpdateToggle);
  }
}
