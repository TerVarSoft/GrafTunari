import { Component } from '@angular/core';
import { LoadingController, AlertController, Platform } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { ProductsPage } from '../pages/products/products';

import { Login } from '../providers/login';
import { SettingsCache } from '../providers/settings-cache';
import { TunariMessages } from '../providers/tunari-messages';
import { TunariNotifier } from '../providers/tunari-notifier';
import { TunariStorage } from '../providers/tunari-storage';

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
    public messages: TunariMessages,
    public notifier: TunariNotifier,
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
        
    this.initialLogin();         
  }

  private initialLogin() {            
    this.storage.getAuthtoken().then(token => {
      if(!token) {        
        let loader = this.notifier.createLoader(this.messages.authenticating);
        this.login.post().subscribe(resp => {
          this.userToken = resp;
          this.storage.setAuthToken(this.userToken.token);                                      
          
          console.log("Token Authentication: " + this.userToken.token);
          loader.dismiss();
          this.loadConfiguration();
        }, error => { 
          loader.dismiss();
          this.handlePullProductsError(error);
        });
      }
      else {
        console.log("Already Authenticated");        
        this.loadConfiguration();
      }
    });   
  }

  private loadConfiguration() {    
    
    this.settingsProvider.loadFromStorage().then(settings => {
      if(settings) {
        console.log("Settings loaded from local storage...");
        this.finishLoading();
        this.settingsProvider.loadFromServer();
      } else {
        let loader = this.notifier.createLoader(this.messages.loadingSettings);
        this.settingsProvider.loadFromServer().subscribe(() => {
          console.log("Settings loaded from the server...");
          this.finishLoading();
          loader.dismiss();          
        }, error => {
          loader.dismiss();
          this.handlePullProductsError(error);
        });
      }                  
    });    
  }  

  private finishLoading() {
    this.isReady = true;           
  }

  private handlePullProductsError(error) {
    if(error.status === 0) {
      this.notifier.createToast(this.messages.noInternetError);
    }
  }  
}

