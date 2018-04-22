import { Component, Input, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';

import { ProductPreviewPage } from '../product-preview/product-preview';

import { TunariApi } from '../../../providers/tunari-api';
import { TunariStorage } from '../../../providers/tunari-storage';
import { ProductImgUtil } from './product-img-util';

import { Product } from '../../../models/product';
import { User } from '../../../models/user';

@Component({
  selector: 'product-img',
  templateUrl: 'product-img.component.html',
  providers: [ProductImgUtil]
})
export class ProductImgComponent implements OnInit {

  @Input() product: Product;

  url: String = 'assets/img/loading.gif';

  constructor(public navCtrl: NavController, public storage: TunariStorage, public api: TunariApi, public util: ProductImgUtil) { }

  ngOnInit() {
    this.url = 'assets/img/loading.gif';

    this.api
      .getImage(this.product.thumbnailUrl)
      .subscribe(url => {
        this.url = url;
      },
        error => {
          if (error.status === 0) {
            this.url = 'assets/img/errorLoading.gif';
          } else if (error.status === 404) {
            this.url = 'assets/img/defaultProduct.png';
          }
        });
  }

  openImage(event, product: Product) {
    event.stopPropagation();

    this.storage.getUser().subscribe((user: User) => {
      const isPublicUser = (user.role == 'public') ? true : false;

      if (isPublicUser) {
        this.navCtrl.push(ProductPreviewPage, {
          product: product
        });
      }

    });

  }
}