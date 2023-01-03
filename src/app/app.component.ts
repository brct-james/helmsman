import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent {
  title = 'helmsman';

  constructor(public api: ApiService) {}

  get username(): string {
    if (this.api.haveSession) {
      return this.api.retrieveLocally('userInfo') === null
        ? 'HELMSMAN'
        : this.api.retrieveLocally('userInfo').username;
    } else {
      return 'HELMSMAN';
    }
  }

  async refreshStarmap() {
    await this.api.getAllSystems();
  }
}
