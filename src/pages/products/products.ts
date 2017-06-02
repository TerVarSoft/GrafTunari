import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, productsProvider: Products, util: ProductsUtil) {    

    productsProvider.get()
      .map(productsObject => util.processProductObject(productsObject))
      .subscribe(products => this.products = products);
  }  
}
