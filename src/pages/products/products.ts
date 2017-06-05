import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController } from 'ionic-angular';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { Products } from '../../providers/products';
import { ProductsUtil } from './products-util';
import { TunariMessages } from '../../providers/tunari-messages';
import { TunariNotifier } from '../../providers/tunari-notifier';

import { Product } from '../../models/product';

@Component({  
  selector: 'page-products',
  templateUrl: 'products.html',
  providers: [ProductsUtil]
})
export class ProductsPage {

  private products: Product[];

  private searchQuery: FormControl = new FormControl();

  private page: number = 1;

  constructor(public navCtrl: NavController, 
    public productsProvider: Products, 
    public util: ProductsUtil, 
    public notifier: TunariNotifier,
    public messages: TunariMessages) {        
    
    this.initFavorites();    
    this.initSearchQuery();
  }  

  private initFavorites() {
    this.productsProvider.getFavorites().then(productsObject => {
      if(productsObject) {
        console.log("Favorites pulled from storage...");
        this.products = this.util.processProductObject(productsObject);
        this.productsProvider.loadFavoritesFromServer();
      } else {
        console.log("Favorites pulled from the server...");
        let loader = this.notifier.createLoader("Cargando Novedades");
        this.productsProvider.loadFavoritesFromServer()
          .map(productsObject => this.util.processProductObject(productsObject))
          .subscribe(products => {
            this.products = products
            loader.dismiss();
          }, error => this.handlePullProductsError(error));          
      }
    });
  }

  private pullNextProductsPage(infiniteScroll) {
      this.page ++;
      console.log('Pulling page ' + this.page + '...');
      
      this.productsProvider.get(this.searchQuery.value, this.page)
        .map(productsObject => this.util.processProductObject(productsObject))
        .subscribe( 
            products => this.products.push(...products),
            error => {
              this.handlePullProductsError(error);
              infiniteScroll.complete();
            },
            () => {
              infiniteScroll.complete();
              console.log('Finished pulling page successfully');
        });
  }

  private initSearchQuery() {
    this.searchQuery.valueChanges
      .filter(query => query)
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(query => this.productsProvider.get(query))
      .map(productsObject => this.util.processProductObject(productsObject))
      .subscribe(products => {
        this.page = 1;
        this.products = products
      }, error => this.handlePullProductsError(error));
  }
  
  private handlePullProductsError(error) {
    if(error.status === 0) {
      this.notifier.createToast(this.messages.noInternetError);
    }
  }  
}
