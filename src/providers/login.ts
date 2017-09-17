import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { SettingsCache } from './settings-cache';
import { TunariStorage } from '../providers/tunari-storage';
import { TunariApi } from './tunari-api';

import { UserToken } from './../models/user-token';

/**
 * Login endpoint provider. 
 */
@Injectable()
export class Login {

    baseUrl: string;

    endpoint: string = "login";

    defaultUserName = "tunariTest";
    defaultPassword = "tunariTest";

    constructor(public api: TunariApi, public storage: TunariStorage, public settingsProvider: SettingsCache) {
        this.baseUrl = this.api.baseUrl + "/login";
    }

    authenticate(userName: string, password: string) {

        if (!userName || !password) {
            userName = this.defaultUserName;
            password = this.defaultPassword;
        }

        return this.storage.getAuthtoken().flatMap(token => {
            return this.storage.getUser().flatMap(user => {
                if (!token || !user) {
                    return this.post(userName, password).flatMap((resp: UserToken) => {
                        return this.storage.setUser(resp.user).flatMap(() => {
                            console.log("Token Authentication has been sent from the server");
                            console.log(resp.user);
                            return this.storage.setAuthToken(resp.token).flatMap(() => this.settingsProvider.load());
                        });
                    });
                }
                else {
                    console.log("Already Authenticated");
                    return this.settingsProvider.load();
                }
            });
        });
    }

    post(userName: string, password: string) {

        return this.api.post(this.endpoint, {
            userName: userName,
            password: password
        });
    }
}