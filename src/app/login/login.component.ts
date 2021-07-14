import { Component, Input, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
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
    let res: string;
    try {
      res = this.api.login(
        this.username,
        this.token,
        function (success: boolean, message: string) {
          this.message = message;
          if (success) {
            this.router.navigate(['/settings']);
          }
        }.bind(this)
      );
    } catch (e) {
      console.log(e);
    }
    this.message = res;
  }
}
