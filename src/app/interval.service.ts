import { Injectable } from '@angular/core';

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
  DEBUG = true;
  //Interval Service minimum interval is 1000ms/1s
  tickRate = 1000;

  constructor() {
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

  calcTimeRemaining(target: any): number {
    let now = Date.now();
    let res = target.interval - (now - target.lastCalled);
    return res >= 0 ? res : 0;
  }

  findByName(name: string, targetArr: any[]): any {
    let res = targetArr.filter((obj) => obj.name === name);
    return res[0];
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
      this.timeRemainingTillCall[obj.name] = this.calcTimeRemaining(obj);
      return obj;
    });
  }
}
