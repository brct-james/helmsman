import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass']
})
export class LoginComponent implements OnInit {
  message: string = '';
  username: string = '';
  token: string = '';
  constructor(private api: ApiService, private router: Router) {}

  ngOnInit(): void {
    if (this.api.haveSession) {
      this.router.navigate(['/']);
    }
  }

  attemptLogin(): void {
    this.message = 'Attemping login...';
    try {
      this.message = this.api.login(
        this.username,
        this.token
      );
    } catch (e) {
      console.log(e);
    }
  }
}
