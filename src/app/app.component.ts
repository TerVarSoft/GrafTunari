import { Component } from '@angular/core';
import { LoadingController, AlertController, Platform, Loading } from 'ionic-angular';
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
        
    this.initialLogin();         
  }

  private initialLogin() {            
    this.storage.getAuthtoken().then(token => {
      if(!token) {        
        let loader = this.createLoader("Autenticando GrafTunari");        
        this.login.post().subscribe(resp => {
          this.userToken = resp;
          this.storage.setAuthToken(this.userToken.token);                                      
          
          console.log("Token Authentication: " + this.userToken.token);
          loader.dismiss();
          this.loadConfiguration();
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
        let loader = this.createLoader("Cargando configuraciones basicas");
        this.settingsProvider.loadFromServer().add(() => {
          console.log("Settings loaded from the server...");
          this.finishLoading();
          loader.dismiss();          
        });
      }                  
    });    
  }

  private createLoader(message: string): Loading {
    let loader = this.loadingCtrl.create();  
    loader.setContent(message);
    loader.present();

    return loader;
  }

  private finishLoading() {
    this.isReady = true;           
  }
}

