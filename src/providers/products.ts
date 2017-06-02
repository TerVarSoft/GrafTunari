import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import { TunariApi } from './tunari-api';

/**
 * Products endpoint provider. 
 */
@Injectable()
export class Products {

  baseUrl: string;

  endpoint: string = "products";

  constructor(public api: TunariApi) { }

  get() {
    return this.api.get(this.endpoint);
  }  
}