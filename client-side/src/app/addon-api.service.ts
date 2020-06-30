import { debug } from 'util';
import { Injectable, Input } from "@angular/core";
import { ActivatedRoute, Router } from '@angular/router';

//@ts-ignore
import {UserService} from 'pepperi-user-service';

import jwt from 'jwt-decode';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class AddonApiService
{
    isInDevMode = false
    addonUUID = ''
    addonVersion = 'v1.0'
    accessToken = ''
    parsedToken: any
    papiBaseURL = ''
    cdnBaseURL = 'https://cdn.staging.pepperi.com'
    localhostBaseURL = 'http://localhost:4400'
    staticDir = ''
    addonStaticUrl = ''


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
        this.accessToken = this.userService.getUserToken();
        this.parsedToken = jwt(this.accessToken);
        this.papiBaseURL = this.parsedToken["pepperi.baseUrl"]
        
    }

    getAddonApiBaseURL(): string {
        return this.isInDevMode ? this.localhostBaseURL : `${this.papiBaseURL}/addons/api/${this.addonUUID}`;
    }

    getAddonStaticFolderURL(callbackFunc = null): string {
        var baseURL = this.isInDevMode ? this.localhostBaseURL : this.cdnBaseURL;
        return `${baseURL}/Addon/Public/${this.addonUUID}/${this.addonVersion}/`;
    }

    get(url: string) {
        const fullURL = url.startsWith('http') ? url : this.papiBaseURL + url;
         const options = { 
             'headers': {
                 'Authorization': 'Bearer ' + this.accessToken
             }
         };
         return this.httpClient.get<any>(fullURL, options);

    }
}