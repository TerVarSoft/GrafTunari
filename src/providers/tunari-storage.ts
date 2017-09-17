import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromPromise';

/**
 * Tunari wrapper to access storage.
 */
@Injectable()
export class TunariStorage {

    private authTokenKey: string = "authTokenPublic";

    private userKey: string = "userInfo";
    
    private userRoleKey: string = 'userRole';

    private settingsKey: string = "settings";

    private productFavoritesKey: string = "productFavorites";

    constructor(public storage: Storage) { }

    public getAuthtoken() {
        return Observable.fromPromise(this.getValue(this.authTokenKey));
    }

    public setAuthToken(value: string) {
        return Observable.fromPromise(this.setValue(this.authTokenKey, value));
    }

    public getUser() {
        return Observable.fromPromise(this.getValue(this.userKey))
            .map(user => JSON.parse(user));
    }

    public setUser(value: any) {
        return Observable.fromPromise(this.setValue(this.userKey, JSON.stringify(value)));
    }

    public getUserRole() {
        return Observable.fromPromise(this.getValue(this.userRoleKey));
    }
    
    public setUserRole(value: string) {
        return Observable.fromPromise(this.setValue(this.userRoleKey, 'wooork'));
    }

    public getSettings() {
        return Observable.fromPromise(this.getValue(this.settingsKey))
            .map(settings => JSON.parse(settings));
    }

    public setSettings(value: any) {
        this.setValue(this.settingsKey, JSON.stringify(value));
    }

    public getProductFavorites() {
        return this.getValue(this.productFavoritesKey).then(favorites => {
            return JSON.parse(favorites);
        });
    }

    public setProductFavorites(value: any) {
        this.setValue(this.productFavoritesKey, JSON.stringify(value));
    }

    public removeStorage() {
        this.storage.clear();
    }

    private getValue(key: string) {
        return this.storage.get(key);
    }

    private setValue(key: string, value: string) {
        return this.storage.set(key, value);
    }
}