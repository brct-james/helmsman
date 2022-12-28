import { Component } from '@angular/core';
import { ApiService } from './api.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'helmsman';

  constructor(public api: ApiService) {}

  get username(): string {
    return this.api.retrieveLocally('userInfo') === null ? 'Helmsman' : this.api.retrieveLocally('userInfo').username;
  }
}
