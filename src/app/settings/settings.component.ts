import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
})
export class SettingsComponent implements OnInit {
  constructor(public api: ApiService) {}

  ngOnInit(): void {}

  get username(): string {
    return this.api.retrieveLocally('userInfo') === null ? '[None]' : this.api.retrieveLocally('userInfo').username;
  }

  get token(): string {
    return this.api.retrieveLocally('userInfo') === null ? '[None]' : this.api.retrieveLocally('userInfo').userToken;
  }
}
