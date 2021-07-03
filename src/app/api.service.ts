import { Injectable } from '@angular/core';
import { SpaceTraders } from 'spacetraders-sdk';
import { LocalStorageService } from 'ngx-webstorage';

@Injectable({
    providedIn: 'root',
})
export class ApiService {
    api: SpaceTraders;
    // accountInfo: any;
    // userToken: string;

    constructor(private ls: LocalStorageService) {
        // this.accountInfo = {
        //     username: "",
        //     joinedAt: "",
        //     shipCount: -1,
        //     structureCount: -1,
        //     credits: -1
        // }
        this.api = new SpaceTraders(
            { useSharedLimiter: true },
            { maxConcurrent: 2, minTime: 500 }
        );
        this.checkSessionStatus();
    }

    checkSessionStatus() {
        this.clearLocally("userInfo");
        console.log("Checking for cached credentials to resume session")
        let localCredentials = this.retrieveLocally("userInfo");
        if (localCredentials) {
            //saved session, attempt login with same
            console.log("Credentials found for:", localCredentials.username);
            this.login(localCredentials.username, localCredentials.token);
        }
        else {
            //no session saved, request user credentials
            //temporarily hardcoding these creds
            console.log("No credentials found locally, requesting new credentials from user")
            this.login('Greenitthe', 'c8283f54-c08f-4773-8c40-fc99b0071a19');
        }
    }

    login(username: string, token?: string) {
        console.log("Attempting login with:",username, "| token:",token)
        this.api.init(username, token).then((token: any) => {
            // this.userToken = token;
            this.storeLocally("userInfo", {username: username, userToken: token});
        });
        //After login cache user info, then request basic account info from api
        this.getAccountInfo();
    }

    getAccountInfo() {
        this.api.getAccount().then((res: any) => {
            this.storeLocally("accountInfo", res.user);
            // this.accountInfo = res;
            this.pushNetWorth(res.user.credits);
            console.log('Account Info:', res.user);
        });
    }

    pushNetWorth(newValue: number) {
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
        this.storeLocally("netWorthHistory", netWorth);
        //this.clearLocally("netWorthHistory")
    }

    storeLocally(key: string, data: any) {
        console.log("Storing:", key, data)
        this.ls.store(key, data);
    }

    retrieveLocally(key: string) {
        return JSON.parse(JSON.stringify(this.ls.retrieve(key)));
    }

    clearLocally(key: string) {
        return this.ls.clear(key);
    }

    /*
    Need to get data consistently every 5 min
    timeout(checkonems, 299900)
    checkSaveHistory:
        if(Date.now() - lastSaved >= 300000)
            getAccount
            cacheLocally
            timeout(checkSaveHistory, 299900)
        else
            timeout(checkSaveHistory, 1)
    */
}
