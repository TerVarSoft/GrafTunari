import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { NavController } from 'ionic-angular';

import { ProductsPage } from '../../pages/products/products';

import { Login } from '../../providers/login';
import { SettingsCache } from '../../providers/settings-cache';
import { TunariMessages } from '../../providers/tunari-messages';
import { TunariNotifier } from '../../providers/tunari-notifier';
import { TunariStorage } from '../../providers/tunari-storage';


@Component({
    selector: 'page-login',
    templateUrl: 'login.html'
})
export class LoginPage {
    loginInfo: { username?: string, password?: string } = {};
    submitted: boolean = false;

    constructor(public navCtrl: NavController,
        public loginService: Login,
        public settingsProvider: SettingsCache,
        public notifier: TunariNotifier,
        public storage: TunariStorage,
        public messages: TunariMessages) {
    }

    onLogin(form: NgForm) {
        this.submitted = true;

        if (form.valid) {
            let loader = this.notifier.createLoader(this.messages.authenticating);
            this.storage.removeStorage();
            this.loginService.authenticate(this.loginInfo.username, this.loginInfo.password).subscribe(() => {
                this.navCtrl.setRoot(ProductsPage);
                loader.dismiss();
            }, error => {
                loader.dismiss();
                this.notifier.createToast(this.messages.invalidUser);
            });
        }
    }
}
