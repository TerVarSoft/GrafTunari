import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { Settings } from './settings';

/**
 * Settings Cache provider. 
 */
@Injectable()
export class SettingsCache {  

  settings: any;

  constructor(public settingsProvider: Settings) {}

  getImgServerUrl() : string {
    return this.settings.filter(setting => setting.key === 'imgServer')[0].value;
  }  

  setSettings(settings: any) {
    this.settings = settings;
  }

  load() {
    return this.settings = this.settingsProvider.get()
      .subscribe(settingsResponse => this.settings = settingsResponse.items);
  }
}