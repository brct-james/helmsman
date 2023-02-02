import { Injectable } from '@angular/core';
import {
  AgentsService,
  Contract,
  ContractsService,
  DefaultService,
  FactionsService,
  FleetService,
  Register201ResponseData,
  RegisterRequest,
  Ship,
  System,
  SystemsService,
  Waypoint,
} from 'spacetraders-v2-ng';
import { Router } from '@angular/router';
import { Clipboard } from '@angular/cdk/clipboard';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  haveSession: BehaviorSubject<boolean> = new BehaviorSubject(true);
  DEBUG: boolean = true;

  constructor(
    private storage: StorageService,
    private router: Router,
    private clipboard: Clipboard,
    private defaultService: DefaultService,
    private agentsService: AgentsService,
    private contractsService: ContractsService,
    private fleetService: FleetService,
    private systemsService: SystemsService
  ) {
    // setInterval(this.refreshInterval.bind(this), 5000);
    this.checkSessionStatus();
  }

  // get lastUpdated(): number {
  //   let res = this.storage.retrieve('lastUpdated');
  //   return res === null ? Date.now() - 60000 : res;
  // }

  // set lastUpdated(newTimestamp: number) {
  //   this.storage.store('lastUpdated', newTimestamp);
  // }

  // get lastArchived(): number {
  //   let res = this.storage.retrieve('lastArchived');
  //   return res === null ? Date.now() - 9000000 : res; //300000 * 30 = 9000000
  // }

  // set lastArchived(newTimestamp: number) {
  //   this.storage.store('lastArchived', newTimestamp);
  // }

  checkSessionStatus() {
    // this.storage.delete("userInfo");
    this.DEBUG &&
      console.log(
        '[api-service::checkSessionStatus] Checking for cached credentials to resume session'
      );
    let retrievedUserInfo = this.storage.retrieve('userInfo');
    if (retrievedUserInfo) {
      let credentials = retrievedUserInfo.data;
      this.DEBUG &&
        console.log('[api-service] Retrieved Credentials:', credentials);
      //saved session, attempt login with same
      this.DEBUG &&
        console.log(
          '[api-service] Validating Credentials for User:',
          credentials.get('username')
        );
      this.login(credentials.get('userToken'), true);
    } else {
      //no session saved, request user credentials
      //temporarily hardcoding these creds
      this.DEBUG &&
        console.log(
          '[api-service] No credentials found locally, requesting new credentials from user'
        );
      this.router.navigate(['/login']);
    }
  }

  mapOfFactionNameToEnum: Record<string, RegisterRequest.FactionEnum> = {
    Cosmic: RegisterRequest.FactionEnum.Cosmic,
    Void: RegisterRequest.FactionEnum.Void,
    Galactic: RegisterRequest.FactionEnum.Galactic,
    Quantum: RegisterRequest.FactionEnum.Quantum,
    Dominion: RegisterRequest.FactionEnum.Dominion,
    // Astro: RegisterRequest.FactionEnum.Astro,
    // Corsairs: RegisterRequest.FactionEnum.Corsairs,
    // United: RegisterRequest.FactionEnum.United,
    // Solitary: RegisterRequest.FactionEnum.Solitary,
    // Cobalt: RegisterRequest.FactionEnum.Cobalt,
  };

  async register(factionName: string, symbol: string): Promise<string> {
    symbol = symbol.toUpperCase();
    let faction: RegisterRequest.FactionEnum =
      this.mapOfFactionNameToEnum[factionName];
    this.DEBUG &&
      console.log(
        '[api-service] Attempting registration with:',
        symbol,
        '| faction:',
        faction
      );
    let registerRequest: RegisterRequest = {
      faction: faction,
      symbol: symbol,
    };
    return new Promise((resolve, reject) => {
      this.defaultService.register(registerRequest).subscribe((response) => {
        if (response != undefined) {
          let data = response.data;
          this.storage.store(
            'userInfo',
            new Map<string, string>([
              ['username', symbol],
              ['userToken', data.token],
            ])
          );
          this.storage.store(
            'agentInfo',
            new Map<string, string>([
              ['accountId', data.agent.accountId],
              ['credits', data.agent.credits.toString()],
              ['headquarters', data.agent.headquarters],
              ['symbol', data.agent.symbol],
            ])
          );
          this.storage.store(
            'contracts',
            new Map<string, Contract>([[data.contract.id, data.contract]])
          );
          this.storage.store(
            'fleet',
            new Map<string, Ship>([[data.ship.symbol, data.ship]])
          );
          // this.clipboard.copy(data.token);
          this.haveSession.next(true);
          this.router.navigate(['/settings']);
          resolve(data.token);
        } else {
          reject('Response Undefined - Could not Parse Response');
        }
      });
    });
  }

  async login(token: string, skipRedirect = false): Promise<string> {
    let message: string;
    this.DEBUG &&
      console.log('[api-service] Attempting login with token:', token);
    this.agentsService.configuration.credentials['AgentToken'] = token;
    // TODO: see if the above works for setting credentials that getMyAgent request can use. Also write code for below to getMyAgent and other relevant entries
    let agentResolution = await new Promise((resolve, reject) => {
      this.agentsService.getMyAgent().subscribe((response) => {
        if (response != undefined) {
          let data = response.data;
          this.haveSession.next(true);
          this.storage.store(
            'userInfo',
            new Map<string, string>([
              ['username', data.symbol],
              ['userToken', token],
            ])
          );
          this.storage.store(
            'agentInfo',
            new Map<string, string>([
              ['accountId', data.accountId],
              ['credits', data.credits.toString()],
              ['headquarters', data.headquarters],
              ['symbol', data.symbol],
            ])
          );
          resolve(true);
        } else {
          reject('Response undefined');
        }
      });
    });
    this.DEBUG && console.log('[api-service] Resolved Agent, Set Have Session');

    let contractsResolution = await new Promise((resolve, reject) => {
      this.contractsService
        .getContracts(undefined, 100)
        .subscribe((response) => {
          if (response != undefined) {
            let data = response.data;
            let contractMap = data.map((contract) => {
              let res: [string, Contract] = [contract.id, contract];
              return res;
            });
            this.storage.store(
              'contracts',
              new Map<string, Contract>(contractMap)
            );
            resolve(true);
          } else {
            reject('Response undefined');
          }
        });
    });

    this.DEBUG && console.log('[api-service] Resolved Contracts');

    let fleetResolution = await this.getAllShips();

    this.DEBUG && console.log('[api-service] Resolved Fleet');

    if (agentResolution && contractsResolution && fleetResolution) {
      return new Promise((resolve, reject) => {
        this.DEBUG && console.log('[api-service] Logged in');
        if (!skipRedirect || this.router.url === '/login') {
          this.router.navigate(['/settings']);
        }
        // this.clipboard.copy(token);
        resolve(token);
      });
    }
    this.DEBUG && console.log('[api-service] Failed login');
    return new Promise((resolve, reject) => {
      reject;
    });
  }

  async getAccountInfo() {
    await new Promise((resolve, reject) => {
      this.agentsService.getMyAgent().subscribe((response) => {
        if (response != undefined) {
          let data = response.data;
          this.storage.store(
            'agentInfo',
            new Map<string, string>([
              ['accountId', data.accountId],
              ['credits', data.credits.toString()],
              ['headquarters', data.headquarters],
              ['symbol', data.symbol],
            ])
          );
          resolve(true);
        } else {
          reject('Response undefined');
        }
      });
    });
  }

  //   getAccountInfoAndPushNW() {
  //     this.api.getAccount().then((res: any) => {
  //       this.storage.store('accountInfo', res.user);
  //       this.pushNetWorth(res.user.credits);
  //       this.DEBUG && console.log('[api-service] Got accountInfo and pushedNetWorth');
  //     });
  //   }

  async getAllShips(): Promise<string> {
    return await new Promise((resolve, reject) => {
      this.fleetService.getMyShips(undefined, 100).subscribe((response) => {
        if (response != undefined) {
          let data = response.data;
          let shipMap = data.map((ship) => {
            let res: [string, Ship] = [ship.symbol, ship];
            return res;
          });
          this.storage.store('fleet', new Map<string, Ship>(shipMap));
          resolve('Success');
        } else {
          reject('Response undefined');
        }
      });
    });
  }

  async getAllSystems(): Promise<string> {
    console.log(
      '[api-service::getAllSystems] Received Request to getAllSystems'
    );
    return await new Promise(async (resolve, reject) => {
      let allSystems: Array<System> = [];
      let limit = 100;
      let page = 1;
      let count = 0;
      let total = 0;
      let response = await firstValueFrom(
        this.systemsService.getSystems(page, limit)
      );
      if (response != undefined) {
        count += limit;
        page += 1;
        total = response.meta.total;
        allSystems = response.data;
      } else {
        console.log('[api-service::getAllSystems] Failed to getSystems');
        reject('Failed to getSystems');
      }

      console.log(
        '[api-service::getAllSystems] Got page 1 up to limit 100:',
        allSystems
      );

      while (count < total) {
        try {
          response = await firstValueFrom(
            this.systemsService.getSystems(page, limit)
          );
        } catch (e) {
          if (e instanceof HttpErrorResponse && e.status == 429) {
            type RatelimitErrorResponse = {
              error: {
                message: string;
                code: number;
                data: {
                  type: string;
                  retryAfter: number;
                  limitBurst: number;
                  limitPerSecond: number;
                  remaining: number;
                  reset: string;
                };
              };
            };
            let rlErr: RatelimitErrorResponse = e.error;
            console.log(
              '[api-service::getAllSystems] Hit Ratelimit Response, Awaiting till retryAfter:',
              rlErr.error.data.retryAfter * 1000,
              'ms'
            );
            await new Promise((resolve) =>
              setTimeout(resolve, rlErr.error.data.retryAfter * 1000)
            );
            continue;
          }
        }
        if (response != undefined) {
          count += limit;
          page += 1;
          total = response.meta.total;
          allSystems.concat(response.data);
        } else {
          console.log(
            `[api-service::getAllSystems] Failed during getSystems batching: (page ${page}) (count ${count}) (total ${total}) (limit ${limit})`
          );
          reject(
            `Failed during getSystems batching: (page ${page}) (count ${count}) (total ${total}) (limit ${limit})`
          );
        }
      }

      let systemsMap = allSystems.map((system) => {
        let res: [string, System] = [system.symbol, system];
        return res;
      });
      this.storage.store('systems', new Map<string, System>(systemsMap));

      resolve('');
    });
  }

  async getSystemWaypoints(systemSymbol: string): Promise<string> {
    return await new Promise((resolve, reject) => {
      this.systemsService
        .getSystemWaypoints(systemSymbol, undefined, 100)
        .subscribe((response) => {
          if (response != undefined) {
            let data = response.data;
            let storedWpts = this.storage.retrieve('waypoints');
            let waypoints: Map<string, Waypoint[]> = new Map<
              string,
              Waypoint[]
            >();
            if (storedWpts) {
              waypoints = storedWpts.data;
            }
            waypoints.set(systemSymbol, data);
            this.storage.store('waypoints', waypoints);
            resolve('Success');
          } else {
            reject('Response undefined');
          }
        });
    });
  }

  // refreshInterval() {
  //   if (this.haveSession) {
  //     this.DEBUG && console.log('[api-service] Refresh check with session');
  //     let now = new Date();
  //     let nowMinutes = now.getMinutes();
  //     let nowValue = now.valueOf();
  //     // Check for update account info interval (60s: 60000)
  //     if (nowValue - this.lastUpdated >= 60000) {
  //       this.DEBUG &&
  //         console.log(
  //           '[api-service] Refresh interval reached, updating accountInfo.'
  //         );
  //       // this.getAccountInfo();
  //       this.lastUpdated = nowValue + 1;
  //     }
  //     // Check for archive new net worth data point (300s: 300000)
  //     let nmString = nowMinutes.toString();
  //     nmString = nmString[nmString.length - 1];
  //     if (
  //       nowValue - this.lastArchived >= 300000 &&
  //       (nmString == '5' || nmString == '0')
  //     ) {
  //       this.DEBUG &&
  //         console.log(
  //           '[api-service] Refresh interval reached, archiving net worth.'
  //         );
  //       let numMissed = Math.floor(
  //         (10000 + nowValue - this.lastArchived) / 300000
  //       );
  //       this.DEBUG &&
  //         console.log(
  //           '[api-service] Applying all archive intervals (missed + 1 current):',
  //           numMissed
  //         );
  //       for (let i = 1; i <= numMissed - 1; i++) {
  //         let cTime = this.lastArchived + i * 300000;
  //         // this.pushNetWorth(null, cTime);
  //       }
  //       // this.getAccountInfoAndPushNW();
  //       this.lastArchived = nowValue;
  //     }
  //   } else {
  //     this.DEBUG &&
  //       console.log('[api-service] Refresh check, no session found');
  //   }
  // }
}
