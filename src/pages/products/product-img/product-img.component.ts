import { Component, Input, OnInit } from '@angular/core';

import { TunariApi } from '../../../providers/tunari-api';
import { ProductImgUtil } from './product-img-util';

import { Product } from '../../../models/product';

@Component({
  selector: 'product-img',
  templateUrl: 'product-img.component.html',
  providers: [ProductImgUtil]
})
export class ProductImgComponent implements OnInit {

  @Input() product: Product;

  url: String = 'assets/img/loading.gif';

  constructor(public api: TunariApi, public util: ProductImgUtil) {}

  ngOnInit() { 
    this.url = 'assets/img/loading.gif';

    this.api
      .getImage(this.product.thumbnailUrl)
      .subscribe(url => {
        this.url = url;
      },
      error => {
        if(error.status === 0) {
          this.url = 'assets/img/errorLoading.gif';
        } else if(error.status === 404) {
          this.url = 'assets/img/defaultProduct.png';
        }
      });
  }
}