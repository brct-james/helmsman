import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  loginOrRegister = 'login';
  message: string = '';
  username: string = '';
  token: string = '';
  faction: string = 'Cosmic';

  get factionKeys(): Array<string> {
    return Object.keys(this.api.mapOfFactionNameToEnum);
  }

  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    console.log('[login-component] Have Session?', this.api.haveSession);
    if (this.api.haveSession) {
      this.router.navigate(['/']);
    }
  }

  async attemptLogin() {
    this.message = 'Attemping login...';
    try {
      this.message = await this.api.login(this.token);
    } catch (e) {
      console.log(e);
    }
  }

  async attemptRegister() {
    this.message = 'Attemping registration...';
    try {
      this.message = await this.api.register(this.faction, this.username);
    } catch (e) {
      console.log(e);
    }
  }
}
