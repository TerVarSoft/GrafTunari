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

    priceTypes: Map<string, string> = new Map();

    constructor(public settingsProvider: Settings,
        public storage: TunariStorage) {
        this.buildPriceTypes();
    }

    getImgServerUrl(): string {
        return this.settings.filter(setting => setting.key === 'imgServer')[0].value;
    }

    getPriceTypes(): Map<string, string> {
        return this.priceTypes;
    }

    getPriceTypeText(key: string): string {
        return this.priceTypes.get(key);
    }

    load() {
        return this.loadFromStorage().flatMap(settings => {
            if (settings) {
                console.log("Settings loaded from local storage...");
                console.log("Updating settings in background...");
                this.loadFromServer().subscribe();

                return this.loadFromStorage();
            } else {
                console.log("Loading settings from the server...");
                return this.loadFromServer();
            }
        });
    }

    loadFromStorage() {
        return this.storage.getSettings().map(settings => {
            this.settings = settings;
            return settings;
        })
    }

    loadFromServer() {
        return this.settingsProvider.get()
            .map(settingsResponse => settingsResponse.items)
            .map(settings => {
                this.storage.setSettings(settings);
                this.settings = settings;

                return settings;
            });
    }

    setSettings(settings: any) {
        this.settings = settings;
    }

    private buildPriceTypes() {
        this.priceTypes.set("clientPackagePrice", "Paquete Imprenta");
        this.priceTypes.set("publicPackagePrice", "Paquete Publico");
    }
}