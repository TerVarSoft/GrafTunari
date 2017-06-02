import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

/**
 * Tunari wrapper to access storage.
 */
@Injectable()
export class TunariStorage {

  private authTokenKey: string = "authToken";

  constructor(public storage: Storage) {}

  public getAuthtoken() {
    return this.getValue(this.authTokenKey); 
  }

  public setAuthToken(value: string) {
    this.setValue(this.authTokenKey, value);
  }

  private getValue(key: string) {
    return this.storage.get(key);
  }

  private setValue(key: string, value: string) {
    this.storage.set(key, value);
  }
}