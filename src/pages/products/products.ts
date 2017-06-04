import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { LoadingController, Loading } from 'ionic-angular';
import { NavController } from 'ionic-angular';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { Products } from '../../providers/products';
import { ProductsUtil } from './products-util';

import { Product } from '../../models/product';

@Component({  
  selector: 'page-products',
  templateUrl: 'products.html',
  providers: [ProductsUtil]
})
export class ProductsPage {

  private products: Product[];

  private searchQuery: FormControl = new FormControl();

  constructor(public navCtrl: NavController, 
    public productsProvider: Products, 
    public util: ProductsUtil,
    public loadingCtrl: LoadingController) {        
    
    this.initFavorites();    
    this.initSearchQuery();
  }  

  private initFavorites() {
    this.productsProvider.getFavorites().then(productsObject => {
      if(productsObject) {
        console.log("Loading products from storage...");
        this.products = this.util.processProductObject(productsObject);
        this.productsProvider.loadFavoritesFromServer();
      } else {
        console.log("Loading products from the server...");
        let loader = this.createLoader("Cargando Novedades");
        this.productsProvider.loadFavoritesFromServer()
          .map(productsObject => this.util.processProductObject(productsObject))
          .subscribe(products => {
            this.products = products
            loader.dismiss();
          });          
      }
    });
  }

  private initSearchQuery() {
    this.searchQuery.valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(query => this.productsProvider.get(query))
      .map(productsObject => this.util.processProductObject(productsObject))
      .subscribe(products => this.products = products);      
  }

  private createLoader(message: string): Loading {
    let loader = this.loadingCtrl.create();  
    loader.setContent(message);
    loader.present();

    return loader;
  }
}
