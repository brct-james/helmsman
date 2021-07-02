import { Injectable } from '@angular/core';
import { SpaceTraders } from 'spacetraders-sdk';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    api: SpaceTraders;
    userToken: string;
    accountInfo: any;

    //const spaceTraders = new SpaceTraders()

    // Already existing user
    //spaceTraders.init('username', 'token')

    // Claim a new user
    //const token = await spaceTraders.init('username')

  constructor() {
    this.api = new SpaceTraders({ useSharedLimiter: true }, { maxConcurrent: 2, minTime: 500 })
  }

  login(username: string, token?: string) {
      this.api.init(username, token).then((token: any) => {this.userToken = token; console.log("Token", this.userToken)});
      this.getAccount();
  }
  
  getAccount() {
      this.api.getAccount().then((res: any) => {this.accountInfo = res; console.log("Account Info", res)});
  }
}
