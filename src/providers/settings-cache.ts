import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Settings } from './settings';
import { TunariStorage } from './tunari-storage';

/**
 * Settings Cache provider. 
 */
@Injectable()
export class SettingsCache {  

  settings: any;

  constructor(public settingsProvider: Settings, 
    public storage: TunariStorage) {}

  getImgServerUrl() : string {
    return this.settings.filter(setting => setting.key === 'imgServer')[0].value;
  }  

  setSettings(settings: any) {
    this.settings = settings;
  }

  loadFromStorage() {    
    return this.storage.getSettings().then(settings => {
      this.settings = settings;
      return this.settings;
    });    
  }

  loadFromServer() {
    return this.settingsProvider.get()
      .map(settingsResponse => settingsResponse.items)
      .subscribe(settings => {        
        this.storage.setSettings(settings);
        this.settings = settings;
      });    
  }
}