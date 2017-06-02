import { RequestOptions, URLSearchParams  } from '@angular/http';
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

  get(query: string) {
    let params: URLSearchParams = new URLSearchParams();
    params.set('tags', query); 
    let requestOptions = new RequestOptions({search: params});        

    return this.api.get(this.endpoint, requestOptions);
  }

  getFavorites() {    
    let params: URLSearchParams = new URLSearchParams();
    params.set('isFavorite', "true"); 
    let requestOptions = new RequestOptions({search: params});        

    return this.api.get(this.endpoint, requestOptions);
  }  
}