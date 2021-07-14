import { Injectable } from '@angular/core';
import { SettingService } from './setting.service';

@Injectable({
  providedIn: 'root',
})
export class IntervalService {
  intervals: any[] = [];
  //To create a 'countdown' till refresh, create a getter accessing this dict in the component (and in the view use {{ timeRemainingGetFleetStatus }}, for example), e.g.:
  // get timeRemainingGetFleetStatus() {
  //   return Math.ceil(this.intervals.timeRemainingTillCall['getFleetStatus'].valueOf() / 1000) + 's';
  // }
  timeRemainingTillCall: { [name: string]: number } = {};
  DEBUG = false;
  //Interval Service minimum interval is 1000ms/1s
  tickRate = 1000;

  constructor(private settings: SettingService) {
    setInterval(this.callIntervals.bind(this), this.tickRate);
  }

  new(name: string, action: Function, interval: number, enabled?: boolean, lastCalled?: number): any {
    //don't forget to bind the scope for action functions when calling .new()
    if (lastCalled === undefined) {
      lastCalled = 0;
    }
    if (enabled === undefined) {
      enabled = true;
    }
    let nInter = {
      name: name,
      action: action,
      interval: interval,
      lastCalled: lastCalled,
      enabled: enabled,
    };
    this.intervals.push(nInter);
    this.DEBUG && console.log('[interval-service] New interval created', nInter);
    return nInter;
  }
  del(name: string): void {}
  clear(): void {
    this.intervals = [];
  }

  calcTimeRemaining(target: any): number {
    let now = Date.now();
    let res = target.interval - (now - target.lastCalled);
    return res >= 0 ? res : 0;
  }

  findByName(name: string, targetArr: any[]): any {
    let res = targetArr.filter((obj) => obj.name === name);
    return res[0];
  }

  isEnabled(name: string): boolean {
    return this.findByName(name, this.intervals).enabled;
  }

  toggleInterval(name: string, status?: boolean): void {
    let interval = this.findByName(name, this.intervals);
    status = status === undefined ? !interval.enabled : status;
    interval.enabled = status;
  }

  callIntervals() {
    this.DEBUG && console.log('[interval-service] Checking intervals for due actions');
    let now = Date.now();
    this.intervals = this.intervals.map((obj) => {
      if (obj.enabled && now - obj.lastCalled >= obj.interval) {
        this.DEBUG && console.log('[interval-service] Calling action on', obj.name);
        obj.action();
        obj.lastCalled = now;
      }
      this.timeRemainingTillCall[obj.name] = this.calcTimeRemaining(obj);
      return obj;
    });
  }
}
