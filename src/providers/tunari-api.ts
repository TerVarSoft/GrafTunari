import { DomSanitizer } from '@angular/platform-browser';
import { Injectable } from '@angular/core';
import { Http, Headers, ResponseContentType, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/observable/fromPromise';
import 'rxjs/add/operator/filter';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/catch';
import 'rxjs/add/observable/throw';

import { TunariStorage } from './tunari-storage';

/**
 * Tunari Api, generic REST api handler.
 */
@Injectable()
export class TunariApi {

     baseUrl: string = 'https://tunariserver.herokuapp.com/api/';

    // baseUrl: string = 'http://localhost:8000/api/';

    authKey: string = 'authorization';

    headers: Headers;

    constructor(public http: Http, public storage: TunariStorage,
        public sanitizer: DomSanitizer, public events: Events) {
        this.headers = new Headers({ 'Content-Type': 'application/json' });
    }

    get(endpoint: string, requestOptions: RequestOptions = new RequestOptions()) {
        let url = this.baseUrl + endpoint;
        requestOptions.headers = new Headers(this.headers);

        return this.getApiToken().flatMap(token => {
            if (token) {
                requestOptions.headers.append(this.authKey, 'Bearer ' + token);
            }

            return this.http.get(url, requestOptions)
                .map(resp => resp.json().data).catch(this.catchErrors());;
        });
    }

    post(endpoint: string, body: any) {
        let url = this.baseUrl + endpoint;
        let requestOptions = new RequestOptions({ headers: this.headers });

        return this.http
            .post(url, body, requestOptions)
            .map(resp => resp.json().data).catch(this.catchErrors());;
    }

    getImage(productUrl: string) {
        let requestOptions = new RequestOptions({
            headers: new Headers(),
            responseType: ResponseContentType.Blob
        });

        return this.http.get(productUrl, requestOptions)
            .map(res => res.blob())
            .map(blob => URL.createObjectURL(blob));
    }

    private getApiToken(): Observable<Headers> {
        return this.storage.getAuthtoken();
    }

    private catchErrors() {

        return (res: Response) => {

            if (res.status === 401 || res.status === 403) {
                console.log("Invalid or expired token. Redirecting to login");

                this.events.publish('user:logout');
            }
            return Observable.throw(res);
        };
    }
}