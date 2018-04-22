import { RequestOptions, URLSearchParams } from '@angular/http';
import { Injectable } from '@angular/core';
import 'rxjs/add/operator/map';

import * as _ from "lodash";

import { TunariApi } from './tunari-api';
import { TunariStorage } from './tunari-storage';

/**
 * Products endpoint provider. 
 */
@Injectable()
export class Products {

    baseUrl: string;

    endpoint: string = "products";

    INVITATIONS_KEY: string = "Invitaciones";

    constructor(public api: TunariApi, public storage: TunariStorage) { }

    get(query: string, page: number = 1) {
        let params: URLSearchParams = new URLSearchParams();
        let commonTags = this.INVITATIONS_KEY + " ";
        params.set('tags', commonTags + query);
        params.set('page', page.toString());
        let requestOptions = new RequestOptions({ search: params });

        return this.api.get(this.endpoint, requestOptions);
    }

    getFavorites() {

        return this.storage.getProductFavorites().then(favoritesObject => {
            return favoritesObject ?
                _.filter(favoritesObject.items, favorite => favorite.category === this.INVITATIONS_KEY) :
                null;
        });
    }

    loadFavoritesFromServer() {
        let params: URLSearchParams = new URLSearchParams();
        params.set('isFavorite', "true");
        let requestOptions = new RequestOptions({ search: params });

        return this.api.get(this.endpoint, requestOptions)
            .map(productsObject => {
                this.storage.setProductFavorites(productsObject);
                productsObject.items = _.filter(productsObject.items, favorite => favorite.category === this.INVITATIONS_KEY);
                return productsObject;
            });
    }
}