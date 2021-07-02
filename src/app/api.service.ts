import { Injectable } from '@angular/core';
import { SpaceTraders } from 'spacetraders-sdk';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    api: SpaceTraders;
    userToken: string;
    accountInfo: any;

    //const spaceTraders = new SpaceTraders()

    // Already existing user
    //spaceTraders.init('username', 'token')

    // Claim a new user
    //const token = await spaceTraders.init('username')

    constructor(private ls: LocalStorageService) {
        this.api = new SpaceTraders(
            { useSharedLimiter: true },
            { maxConcurrent: 2, minTime: 500 }
        );
    }

    login(username: string, token?: string) {
        this.api.init(username, token).then((token: any) => {
            this.userToken = token;
            console.log('Token', this.userToken);
        });
        this.getAccount();
    }

    getAccount() {
        this.api.getAccount().then((res: any) => {
            this.accountInfo = res;
            this.pushNetWorth(res.user.credits);
            console.log('Account Info', res);
        });
    }

    pushNetWorth(newValue: number) {
        //TODO: Expand to consider ship and cargo value as well (toggleable)
        let netWorth = this.retrieveLocally("netWorthHistory");
        if (netWorth && netWorth.values.length > 0 && netWorth.values.length == netWorth.timestamps.length) {
            netWorth.values.push(newValue);
            netWorth.timestamps.push(Date.now().valueOf());
        }
        else {
            netWorth = {
                values: [newValue],
                timestamps: [Date.now().valueOf()]
            };
        }
        this.cacheLocally("netWorthHistory", netWorth);
        //this.clearLocally("netWorthHistory")
    }

    cacheLocally(key: string, data: any) {
        console.log(key, data)
        this.ls.store(key, data);
    }

    retrieveLocally(key: string) {
        return JSON.parse(JSON.stringify(this.ls.retrieve(key)));
    }

    clearLocally(key: string) {
        return this.ls.clear(key);
    }
}
