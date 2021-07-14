import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-webstorage';
// import { IntervalService } from './interval.service';

@Injectable({
  providedIn: 'root',
})
export class SettingService {
  activeSettings = {
    getFleetStatus: true,
  };
  DEBUG = false;
  constructor(private ls: LocalStorageService) {
    this.initSettings();
  }

  get fleetUpdateToggle() {
    return this.activeSettings.getFleetStatus;
  }
  set fleetUpdateToggle(status: boolean) {
    this.activeSettings.getFleetStatus = status;
    this.storeSettings(this.activeSettings);
  }

  initSettings() {
    let storedSettings = this.retrieveSettings();
    if (storedSettings !== null) {
      this.activeSettings = storedSettings;
      this.storeSettings(this.activeSettings);
    }
  }

  storeSettings(data: any) {
    this.DEBUG && console.log('[settings-service] Storing settings:', data);
    this.ls.store('settings', data);
  }

  retrieveSettings() {
    this.DEBUG && console.log('[settings-service] Retrieving settings');
    let res = JSON.parse(JSON.stringify(this.ls.retrieve('settings')));
    return res;
  }
}
