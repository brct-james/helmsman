import { Component } from '@angular/core';
import { ApiService } from './api.service';
import { IntervalService } from './interval.service';
import { StorageService } from './storage.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'helmsman';
  username: string = 'Loading...';
  haveSession: boolean = false;

  constructor(
    public api: ApiService,
    public intervals: IntervalService,
    public storage: StorageService
  ) {
    this.api.haveSession.subscribe((haveSession: boolean) => {
      if (haveSession) {
        console.log(
          '[app - Subscription: api.haveSession] Detected new value:',
          haveSession
        );
        let retrievedUserInfo = this.storage.retrieve('userInfo');
        if (retrievedUserInfo == undefined) {
          this.username = 'Error Loading';
        } else {
          this.username = retrievedUserInfo.data.get('username');
        }
      } else {
        this.username = '[None]';
      }
      this.haveSession = haveSession;
    });
  }

  animateCopySymbol: Record<string, boolean> = {};
  copySymbolEvent(key: string) {
    this.animateCopySymbol[key] = true;
    setTimeout(() => {
      this.animateCopySymbol[key] = false;
    }, 100);
  }

  get timeRemainingGetFleetStatus() {
    if (this.intervals.timeRemainingTillCall['getFleetStatus'] === undefined) {
      return 0;
    }
    return Math.ceil(
      this.intervals.timeRemainingTillCall['getFleetStatus'].valueOf() / 1000
    );
  }

  async refreshStarmap() {
    await this.api.getAllSystems();
  }
}
