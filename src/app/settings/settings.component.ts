import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FleetSettingsComponent } from './fleet-settings/fleet-settings.component';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass']
})
export class SettingsComponent implements OnInit {
  tokenValue = this.token;
  copyMsgVisible = false;

  constructor(public api: ApiService, private router: Router) {}

  ngOnInit(): void {}

  get username(): string {
    return this.api.retrieveLocally('userInfo') === null ? '[None]' : this.api.retrieveLocally('userInfo').username;
  }

  get token(): string {
    return this.api.retrieveLocally('userInfo') === null ? '[None]' : this.api.retrieveLocally('userInfo').userToken;
  }

  showCopyMsg() {
    this.copyMsgVisible = true;
  }

  resetLocalStorage() {
    this.api.clearAllLocalStorage();
    this.router.navigate(['/login']);
  }
}
