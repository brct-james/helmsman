import { Injectable } from '@angular/core';
import { SpaceTraders } from 'spacetraders-sdk';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  api: SpaceTraders;
  haveSession: boolean = false;
  DEBUG = false;

  constructor(private ls: LocalStorageService) {
    this.api = new SpaceTraders({ useSharedLimiter: true }, { maxConcurrent: 2, minTime: 500 });

    setInterval(this.handleInterval.bind(this), 5000);
    this.checkSessionStatus();
  }

  get lastUpdated(): number {
    let res = this.retrieveLocally('lastUpdated');
    return res === null ? Date.now() - 60000 : res;
  }

  set lastUpdated(newTimestamp: number) {
    this.storeLocally('lastUpdated', newTimestamp);
  }

  get lastArchived(): number {
    let res = this.retrieveLocally('lastArchived');
    return res === null ? Date.now() - 9000000 : res; //300000 * 30 = 9000000
  }

  set lastArchived(newTimestamp: number) {
    this.storeLocally('lastArchived', newTimestamp);
  }

  checkSessionStatus() {
    // this.clearLocally("userInfo");
    this.DEBUG && console.log('[api-service] Checking for cached credentials to resume session');
    let localCredentials = this.retrieveLocally('userInfo');
    if (localCredentials) {
      //saved session, attempt login with same
      this.DEBUG && console.log('[api-service] Credentials found for:', localCredentials.username);
      this.login(localCredentials.username, localCredentials.userToken);
    } else {
      //no session saved, request user credentials
      //temporarily hardcoding these creds
      this.DEBUG && console.log('[api-service] No credentials found locally, requesting new credentials from user');
      this.login('Greenitthe', 'c8283f54-c08f-4773-8c40-fc99b0071a19');
    }
  }

  login(username: string, token?: string) {
    this.DEBUG && console.log('[api-service] Attempting login with:', username, '| token:', token);
    this.api.init(username, token).then((token: any) => {
      this.storeLocally('userInfo', {
        username: username,
        userToken: token,
      });
      //After login cache user info, then request basic account info from api
      this.DEBUG && console.log('[api-service] Have session now true, timeout interval will begin ticking, entries will populate at 5 minute marks');
      this.haveSession = true;
    });
  }

  getAccountInfo() {
    this.api.getAccount().then((res: any) => {
      this.storeLocally('accountInfo', res.user);
      this.DEBUG && console.log('[api-service] Got accountInfo:', res.user);
    });
  }

  getAccountInfoAndPushNW() {
    this.api.getAccount().then((res: any) => {
      this.storeLocally('accountInfo', res.user);
      this.pushNetWorth(res.user.credits);
      this.DEBUG && console.log('[api-service] Got accountInfo and pushedNetWorth');
    });
  }

  getAllShips(callback: Function) {
    this.api.getShips().then((res: any) => {
      this.DEBUG && console.log('[api-service] Got all ships info, attempting to get flight plans');
      this.getAndMergeFlightPlans(res.ships, callback);
    });
  }

  getAndMergeFlightPlans(ships: any, callback: Function) {
    //Currently only gets OE system flight plans - will need to expand functionality later and either query for each flightId in ships arr or for each system...
    this.api.getFlightPlans('OE').then((res: any) => {
      // insert flightPlanObj
      console.log(ships);
      res = res.flightPlans;
      console.log(res);
      let mergedArray = this.insertObjByKey(ships, res, 'flightPlanId', 'id');
      this.storeLocally('shipInfo', mergedArray);
      this.DEBUG && console.log('[api-service] Got all flight plan info, running callback');
      console.log(mergedArray);
      callback(mergedArray);
    });
  }

  // https://stackoverflow.com/questions/17880476/joins-in-javascript
  // Modified to insert flight plan object rather than left join contents of object
  insertObjByKey(objArr1: any[], objArr2: any[], key1: string, key2: string) {
    return objArr1.map((anObj1) => ({
      flightPlan: objArr2.find((anObj2) => anObj1[key1] === anObj2[key2]),
      ...anObj1,
    }));
  }

  pushNetWorth(newValue: number, timestamp?: number) {
    if (timestamp === undefined) {
      timestamp = Date.now().valueOf();
    }
    let netWorth = this.retrieveLocally('netWorthHistory');
    if (netWorth && netWorth.values.length > 0 && netWorth.values.length == netWorth.timestamps.length) {
      netWorth.values.push(newValue);
      netWorth.timestamps.push(timestamp);
    } else {
      netWorth = {
        values: [newValue],
        timestamps: [timestamp],
      };
    }
    this.storeLocally('netWorthHistory', netWorth);
    // this.clearLocally('netWorthHistory');
  }

  storeLocally(key: string, data: any) {
    this.DEBUG && console.log('[api-service] Storing:', key, data);
    this.ls.store(key, data);
  }

  retrieveLocally(key: string) {
    return JSON.parse(JSON.stringify(this.ls.retrieve(key)));
  }

  clearLocally(key: string) {
    return this.ls.clear(key);
  }

  clearAllLocalStorage(): void {
    this.ls.clear();
    window.location.reload();
  }

  handleInterval() {
    if (this.haveSession) {
      this.DEBUG && console.log('[api-service] Refresh check with session');
      let now = new Date();
      let nowMinutes = now.getMinutes();
      let nowValue = now.valueOf();
      // Check for update account info interval (60s: 60000)
      if (nowValue - this.lastUpdated >= 60000) {
        this.DEBUG && console.log('[api-service] Refresh interval reached, updating accountInfo.');
        this.getAccountInfo();
        this.lastUpdated = nowValue + 1;
      }
      // Check for archive new net worth data point (300s: 300000)
      let nmString = nowMinutes.toString();
      nmString = nmString[nmString.length - 1];
      if (nowValue - this.lastArchived >= 300000 && (nmString == '5' || nmString == '0')) {
        this.DEBUG && console.log('[api-service] Refresh interval reached, archiving net worth.');
        let numMissed = Math.floor((10000 + nowValue - this.lastArchived) / 300000);
        this.DEBUG && console.log('[api-service] Applying all archive intervals (missed + 1 current):', numMissed);
        for (let i = 1; i <= numMissed - 1; i++) {
          let cTime = this.lastArchived + i * 300000;
          this.pushNetWorth(null, cTime);
        }
        this.getAccountInfoAndPushNW();
        this.lastArchived = nowValue;
      }
    } else {
      this.DEBUG && console.log('[api-service] Refresh check, no session found');
    }
  }
}
