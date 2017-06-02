import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { GrafTunariApp } from './app.component';
import { ProductsPage } from '../pages/products/products';
import { ProductImg } from '../pages/products/product-img/product-img';

import { Login } from '../providers/login';
import { Products } from '../providers/products';
import { Settings } from '../providers/settings';
import { SettingsCache } from '../providers/settings-cache';
import { TunariApi } from '../providers/tunari-api';
import { TunariStorage } from '../providers/tunari-storage';

export function providers() {
  return [
    Login,
    Products,    
    Settings,
    SettingsCache,
    TunariApi,
    TunariStorage,    
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ];
}

@NgModule({
  declarations: [
    GrafTunariApp,
    ProductsPage,
    ProductImg
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(GrafTunariApp),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    GrafTunariApp,
    ProductsPage
  ],
  providers: providers()
})
export class AppModule {}
