import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
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

  constructor(public navCtrl: NavController, public productsProvider: Products, public util: ProductsUtil) {    

    productsProvider.getFavorites()
      .map(productsObject => util.processProductObject(productsObject))
      .subscribe(products => this.products = products);    

    this.initSearchQuery();
  }  

  private initSearchQuery() {
    this.searchQuery.valueChanges
      .debounceTime(100)
      .distinctUntilChanged()
      .switchMap(query => this.productsProvider.get(query))
      .map(productsObject => this.util.processProductObject(productsObject))
      .subscribe(products => this.products = products);      
  }
}
