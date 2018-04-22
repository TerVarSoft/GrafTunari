import { Component, ElementRef, Renderer, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NavController, Alert, FabContainer } from 'ionic-angular';
import { Keyboard } from '@ionic-native/keyboard';
import 'rxjs/add/observable/from';
import "rxjs/add/operator/debounceTime";
import "rxjs/add/operator/distinctUntilChanged"
import "rxjs/add/operator/switchMap";

import { LoginPage } from '../../pages/login/login';
import { UserPage } from '../../pages/user/user';

import { Connection } from '../../providers/connection';
import { Products } from '../../providers/products';
import { ProductsUtil } from './products-util';
import { TunariMessages } from '../../providers/tunari-messages';
import { TunariNotifier } from '../../providers/tunari-notifier';
import { TunariStorage } from '../../providers/tunari-storage';

import { Product } from '../../models/product';
import { User } from '../../models/user';

@Component({
    selector: 'page-products',
    templateUrl: 'products.html',
    providers: [ProductsUtil]
})
export class ProductsPage implements OnInit {

    private isPublicUser: boolean = true;

    private user: User;

    private products: Product[];

    private searchQuery: FormControl = new FormControl();

    private page: number = 0;

    // Price to show to clients should be the first one.
    private selectedPrice: number = 0;    

    constructor(public keyboard: Keyboard,
        public renderer: Renderer,
        private elRef: ElementRef,
        public navCtrl: NavController,
        public productsProvider: Products,
        public util: ProductsUtil,
        public notifier: TunariNotifier,
        public storage: TunariStorage,
        public messages: TunariMessages,
        public connection: Connection) { }

    ngOnInit() {
        this.setDefaultValues()
        this.setupKeyboard();
        this.initFavorites();
        this.initSearchQuery();

    }

    public pullNextProductsPage(infiniteScroll) {

        if (this.page > 0 && this.connection.isConnected()) {
            this.page++;
            console.log('Pulling page ' + this.page + '...');
            this.productsProvider.get(this.searchQuery.value, this.page)
                .map(productsObject => productsObject.items)
                .subscribe(
                    products => this.products.push(...products),
                    null,
                    () => {
                        infiniteScroll.complete();
                        console.log('Finished pulling page successfully');
                    });
        } else {
            infiniteScroll.complete();
        }
    }

    onSearchClear(event) {
        this.blurSearchBar();
    }

    /** Main Fab button functions. */

    /** Toolbar buttons actions*/

    showUserPage() {

        if (this.isPublicUser) {
            this.navCtrl.push(LoginPage);
        } else {
            this.navCtrl.push(UserPage, {
                user: this.user
            });
        }

    }

    /** Private functions */

    private setDefaultValues() {
        this.storage.getUser().subscribe((user: User) => {
            console.log(`User is logged as: ${user.role}`)

            this.isPublicUser = (user.role == 'public') ? true : false;
            this.user = user;
        });
    }

    private setupKeyboard() {
        this.keyboard.onKeyboardHide().subscribe(() => {
            this.blurSearchBar();
        });
    }

    private blurSearchBar() {
        const searchInput = this.elRef.nativeElement.querySelector('.searchbar-input')
        this.renderer
            .invokeElementMethod(searchInput, 'blur');
    }

    private initFavorites() {
        this.page = 0;
        this.productsProvider.getFavorites().then(cachedFavorites => {
            if (cachedFavorites && cachedFavorites.length > 0) {
                console.log("Favorites pulled from storage...");
                this.products = cachedFavorites;
                this.updateFavoritesInBackground();
            } else {
                console.log("Favorites pulled from the server...");
                let loader = this.notifier.createLoader("Cargando Novedades");
                this.productsProvider.loadFavoritesFromServer()
                    .map(productsObject => productsObject.items)
                    .subscribe(products => {
                        this.products = products
                        loader.dismiss();
                    });
            }
        });
    }

    private updateFavoritesInBackground() {
        // Update storage in backgroun with server response.
        console.log("Updating product favorites in background");
        this.productsProvider.loadFavoritesFromServer().subscribe();
    }

    private initSearchQuery() {
        this.searchQuery.valueChanges
            .filter(query => query)
            .filter(query => this.connection.isConnected())
            .debounceTime(100)
            .distinctUntilChanged()
            .switchMap(query => this.productsProvider.get(query))
            .map(productsObject => productsObject.items)
            .subscribe(products => {
                this.page = 1;
                this.products = products
            });

        this.searchQuery.valueChanges
            .filter(query => query)
            .filter(query => !this.connection.isConnected())
            .subscribe(() => this.notifier.createToast(this.messages.noInternetError));

        this.searchQuery.valueChanges
            .filter(query => !query)
            .subscribe(() => this.initFavorites());
    }
}
