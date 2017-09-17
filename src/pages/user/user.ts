import { Component } from '@angular/core';
import { NavController, Alert } from 'ionic-angular';
import { NavParams } from 'ionic-angular';

import { ProductsPage } from '../../pages/products/products';

import { UserUtil } from './user-util';
import { Login } from '../../providers/login';
import { SettingsCache } from '../../providers/settings-cache';
import { TunariStorage } from '../../providers/tunari-storage';
import { TunariMessages } from '../../providers/tunari-messages';
import { TunariNotifier } from '../../providers/tunari-notifier';

import { User } from '../../models/user';

@Component({
    selector: 'page-user',
    templateUrl: 'user.html',
    providers: [UserUtil]
})
export class UserPage {

    user: User;

    constructor(public navParams: NavParams,
        public navCtrl: NavController,
        public util: UserUtil,
        public loginService: Login,
        public storage: TunariStorage,
        public settingsProvider: SettingsCache,
        public messages: TunariMessages,
        public notifier: TunariNotifier) {
        this.user = this.navParams.data.user;
    }

    onLogout() {
        let alert: Alert = this.util.getExitConfirmAlert();
        alert.addButton({
            text: 'Aceptar',
            handler: () => {
                this.logoutUser();
            }
        });

        alert.present();

    }

    private logoutUser() {
        let loader = this.notifier.createLoader(this.messages.loggingOut);
        this.storage.removeStorage();
        this.loginService.authenticate("", "").subscribe(() => {
            this.navCtrl.setRoot(ProductsPage);
            loader.dismiss();
        });
    }
}