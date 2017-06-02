import { Component, Input, OnInit } from '@angular/core';

import { TunariApi } from '../../../providers/tunari-api';
import { ProductImgUtil } from './product-img-util/product-img-util';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-img',
  templateUrl: 'product-img.html',
  providers: [ProductImgUtil]
})
export class ProductImg implements OnInit {

  @Input() product: Product;
  
  private productImgUrl: any;

  constructor(public api: TunariApi, public util: ProductImgUtil) {}

  ngOnInit() {    
    this.api
      .getImage(this.util.buildProductImgUrl(this.product))
      .subscribe(url => this.productImgUrl = url);
    
  }  
}