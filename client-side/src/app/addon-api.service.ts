import { debug } from 'util';
import { Injectable, Input } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

//@ts-ignore
import {UserService} from 'pepperi-user-service';

import jwt from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { PapiClient } from '@pepperi-addons/papi-sdk';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
  })
export class AddonApiService
{
    isInDevMode = false
    addonUUID = ''
    addonVersion = 'v1.0'
    parsedToken: any
    papiBaseURL = ''
    cdnBaseURL = 'https://cdn.staging.pepperi.com'
    localhostBaseURL = 'http://localhost:4400'
    staticDir = ''
    addonStaticUrl = ''

    get papiClient(): PapiClient {
        return new PapiClient({
            baseURL: this.papiBaseURL,
            token: this.userService.getUserToken()
        })
    }
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private userService: UserService,
        private httpClient: HttpClient
    ) {
        this.route.params.subscribe(params => {
            this.addonUUID = params.pluginID;
        });

        this.route.queryParams.subscribe(params => {
            this.isInDevMode = params["dev"] || false;
        });

        this.addonStaticUrl = this.userService.getAddonStaticFolder();
        const accessToken = this.userService.getUserToken();
        this.parsedToken = jwt(accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseurl"]
    }

    getAddonApiBaseURL(): string {
        return this.isInDevMode ? this.localhostBaseURL : `${this.papiBaseURL}/addons/api/${this.addonUUID}`;
    }

    getAddonStaticFolderURL(callbackFunc = null): string {
        var baseURL = this.isInDevMode ? this.localhostBaseURL : this.cdnBaseURL;
        return `${baseURL}/Addon/Public/${this.addonUUID}/${this.addonVersion}/`;
    }

    get(url: string) {
        this.userService.setShowLoading(true);
        const t0 = performance.now();
        const fullURL = url.startsWith('http') ? url : this.papiBaseURL + url;
         const options = { 
             'headers': {
                 'Authorization': 'Bearer ' + this.userService.getUserToken()
             }
         };
         return this.httpClient.get<any>(fullURL, options).pipe(
             tap(() => console.log(`GET ${fullURL} took ${(performance.now() - t0).toFixed(2)}ms`)),
             tap(() => this.userService.setShowLoading(false))
         );

    }
    
    post(url: string, body: any) {
        this.userService.setShowLoading(true);
        const t0 = performance.now();
        const fullURL = url.startsWith('http') ? url : this.papiBaseURL + url;
        const options = { 
            'headers': {
                'Authorization': 'Bearer ' + this.userService.getUserToken()
            }
        };
        return this.httpClient.post<any>(fullURL, body, options).pipe(
            tap(() => console.log(`POST ${fullURL} took ${(performance.now() - t0).toFixed(2)}ms`)),
            tap(() => this.userService.setShowLoading(false))
        );
    }

    clientApiCall(params) {
        return new Promise((resolve, reject) => {
            this.userService.httpPost('Service1.svc/v1/ClientApi/Execute', {
              Request: JSON.stringify(params)
            }, (res) => {
              if (res.Success) {
                resolve(JSON.parse(res.Value));
              }
              else {
                reject();
              }
            });
          });
    }
}