import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { FleetSettingsComponent } from './fleet-settings/fleet-settings.component';
import { Router } from '@angular/router';
import { StorageService } from '../storage.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.sass'],
})
export class SettingsComponent implements OnInit {
  tokenValue: string = '[None]';
  copyMsgVisible = false;
  username: string = '[None]';

  constructor(
    public api: ApiService,
    private router: Router,
    public storage: StorageService
  ) {}

  ngOnInit(): void {
    let retrievedUserInfo = this.storage.retrieve('userInfo');
    if (retrievedUserInfo == undefined) {
      this.username = 'Error Loading';
      this.tokenValue = 'Error Loading';
    } else {
      this.username = retrievedUserInfo.data.get('username');
      this.tokenValue = retrievedUserInfo.data.get('userToken');
    }
  }

  showCopyMsg() {
    this.copyMsgVisible = true;
  }

  resetLocalStorage() {
    this.api.haveSession.next(false);
    this.storage.clearAllLocalStorage();
    this.router.navigate(['/login']);
  }
}
