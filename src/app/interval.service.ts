import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class IntervalService {
  intervals: any[] = [];
  DEBUG = true;
  //Interval Service minimum interval is 1000ms/1s
  tickRate = 1000;

  constructor(public st: ApiService) {
    setInterval(this.callIntervals.bind(this), this.tickRate);
  }

  new(name: string, action: Function, interval: number, lastCalled?: number): any {
    //don't forget to bind the scope for action functions when calling .new()
    if (lastCalled === undefined) {
      lastCalled = 0;
    }
    let nInter = {
      name: name,
      action: action,
      interval: interval,
      lastCalled: lastCalled,
    };
    this.intervals.push(nInter);
    this.DEBUG && console.log('[interval-service] New interval created', nInter);
    return nInter;
  }
  del(name: string): void {}
  clear(): void {
    this.intervals = [];
  }

  callIntervals() {
    this.DEBUG && console.log('[interval-service] Checking intervals for due actions');
    let now = Date.now();
    this.intervals = this.intervals.map((obj) => {
      if (now - obj.lastCalled >= obj.interval) {
        this.DEBUG && console.log('[interval-service] Calling action on', obj.name);
        obj.action();
        obj.lastCalled = now;
      }
      return obj;
    });
  }
}
