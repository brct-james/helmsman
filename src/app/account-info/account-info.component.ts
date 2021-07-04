import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.sass'],
})
export class AccountInfoComponent implements OnInit {
  constructor(public st: ApiService) {}

  ngOnInit(): void {}

  get username(): string {
    // return this.st.accountInfo === undefined
    //     ? '[Error] Could not get account info!'
    //     : this.st.accountInfo.username;
    return this.st.retrieveLocally('userInfo') === null ? '[Error] Could not get user info!' : this.st.retrieveLocally('userInfo').username;
  }

  get token(): string {
    // return this.st.userToken || '[Error] Could not get userToken!';
    return this.st.retrieveLocally('userInfo') === null ? '[Error] Could not get user info!' : this.st.retrieveLocally('userInfo').userToken;
  }

  get credits(): number {
    // return this.st.accountInfo === undefined
    //     ? '[Error] Could not get account info!'
    //     : this.st.accountInfo.credits;
    return this.st.retrieveLocally('accountInfo') === null ? '[Error] Could not get user info!' : this.st.retrieveLocally('accountInfo').credits;
  }

  get shipCount(): number {
    // return this.st.accountInfo === undefined
    //     ? '[Error] Could not get account info!'
    //     : this.st.accountInfo.shipCount;
    return this.st.retrieveLocally('accountInfo') === null ? '[Error] Could not get user info!' : this.st.retrieveLocally('accountInfo').shipCount;
  }

  get structureCount(): number {
    // return this.st.accountInfo === undefined
    //     ? '[Error] Could not get account info!'
    //     : this.st.accountInfo.structureCount;
    return this.st.retrieveLocally('accountInfo') === null
      ? '[Error] Could not get user info!'
      : this.st.retrieveLocally('accountInfo').structureCount;
  }
}
