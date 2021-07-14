import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.component.html',
  styleUrls: ['./account-info.component.sass'],
})
export class AccountInfoComponent implements OnInit {
  constructor(public api: ApiService) {}

  ngOnInit(): void {}

  get username(): string {
    return this.api.retrieveLocally('userInfo') === null ? '[None]' : this.api.retrieveLocally('userInfo').username;
  }

  get token(): string {
    return this.api.retrieveLocally('userInfo') === null ? '[None]' : this.api.retrieveLocally('userInfo').userToken;
  }

  get credits(): number {
    return this.api.retrieveLocally('accountInfo') === null ? '[None]' : this.api.retrieveLocally('accountInfo').credits;
  }

  get shipCount(): number {
    return this.api.retrieveLocally('accountInfo') === null ? '[None]' : this.api.retrieveLocally('accountInfo').shipCount;
  }

  get structureCount(): number {
    return this.api.retrieveLocally('accountInfo') === null ? '[None]' : this.api.retrieveLocally('accountInfo').structureCount;
  }
}
