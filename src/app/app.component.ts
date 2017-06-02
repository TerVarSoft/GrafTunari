import { Component } from '@angular/core';
import { LoadingController, AlertController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { ProductsPage } from '../pages/products/products';

import { Login } from '../providers/login';
import { TunariStorage } from '../providers/tunari-storage';
import { SettingsCache } from '../providers/settings-cache';

import { UserToken } from '../models/user-token';

@Component({
  templateUrl: 'app.html',
})
export class GrafTunariApp {
  
  rootPage:any = ProductsPage;

  private userToken: UserToken;

  private isReady: boolean = false;

  constructor(
    public platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,    
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,    
    public storage: TunariStorage,
    public settingsProvider: SettingsCache,
    public login: Login
  ) {
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });

    this.initialSetup();
  }

  private initialSetup() {
    let loader = this.loadingCtrl.create();
    this.initialLogin(loader);         
  }

  private initialLogin(loader) {    
    loader.setContent("Autenticando GrafTunari");
    loader.present();
    this.storage.getAuthtoken().then(token => {
      if(!token) {        
        this.login.post().subscribe(resp => {
          this.userToken = resp;
          this.storage.setAuthToken(this.userToken.token);                                      
          console.log("Token Authentication: " + this.userToken.token);

          this.loadConfiguration(loader);
        });
      }
      else {
        console.log("Already Authenticated");        
        this.loadConfiguration(loader);
      }
    });   
  }

  private loadConfiguration(loader) {
    loader.setContent("Cargando configuraciones basicas");
    this.settingsProvider.load().add(() => {      
      this.isReady = true;
      loader.dismiss();
    });
  }
}

