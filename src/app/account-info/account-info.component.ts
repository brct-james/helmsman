import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
    selector: 'app-account-info',
    templateUrl: './account-info.component.html',
    styleUrls: ['./account-info.component.sass'],
})
export class AccountInfoComponent implements OnInit {
    constructor(public st: ApiService) {}

    ngOnInit(): void {
        this.st.login('Greenitthe', 'c8283f54-c08f-4773-8c40-fc99b0071a19');
    }

    get username(): string {
        return this.st.accountInfo === undefined
            ? '[Error] No account info available'
            : this.st.accountInfo.user.username;
    }

    get token(): string {
        return (
            this.st.userToken ||
            '[Error] No token received or token invalid for username'
        );
    }

    get credits(): number {
        return this.st.accountInfo === undefined
            ? '--'
            : this.st.accountInfo.user.credits;
    }

    get shipCount(): number {
        return this.st.accountInfo === undefined
            ? '--'
            : this.st.accountInfo.user.shipCount;
    }

    get structureCount(): number {
        return this.st.accountInfo === undefined
            ? '--'
            : this.st.accountInfo.user.structureCount;
    }
}
