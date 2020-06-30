import { Injectable } from '@angular/core';
import { Http, RequestOptions, Headers } from '@angular/http';
import { map } from 'rxjs/operators';
//@ts-ignore
import {UserService} from 'pepperi-user-service';
//@ts-ignore
import {MainService} from 'pepperi-main-service';

// @ts-ignore
import { GlobalDialogComponent, DialogData, DialogDataType } from 'pepperi-dialog';
import { MatDialogConfig, MatDialog } from '@angular/material';
// import { DialogModel, PluginDialogComponent } from './plugin-dialog/plugin-dialog.component';
//@ts-ignore
import {EnvVariables} from 'pepperi-environment-variables';
import { HttpClient } from '@angular/common/http';
import { callbackify } from 'util';
//@ts-ignore
import {PepperiDataConverterService} from 'pepperi-data-converter';
import { AddonsListSearch, DialogModel, SystemData } from './plugin.model';
// import { Overlay } from '@angular/cdk/overlay';

@Injectable()
export class PluginService {
	subscription: any;
	accessToken = '';
	apiBaseURL = '';
    svgIcons;
    pluginUUID: string = '';
    version = 'V1.0';

    constructor(
        private http: Http,
        private http2: HttpClient,
        public userService:  UserService,
        public mainService:  MainService,
        public dialog: MatDialog,
        public pepperiDataConverter: PepperiDataConverterService,
        // private overlay: Overlay
	) {
		this.svgIcons = this.userService.svgIcons;
		this.accessToken = this.userService.getUserToken();
	}

	ngOnInit() {
	}


	httpGet(url, successFunc: any, errorFunc: any = null, showModal: boolean = false, isLoginComponent: boolean = false, showGlobalLoading: boolean = true) {

		const self = this;
        self.userService.setShowLoading(true);

		const headers = new Headers({
			// 'Accept-Language': this.userLang,
			//'Cache-Control': 'no-cache',
			//'Pragma': 'no-cache',
            'Authorization': 'Bearer ' + self.accessToken,
            'X-Pepperi-OwnerID': self.pluginUUID
			//'Accept': '*/*',
		});

		const options = new RequestOptions({ headers: headers, method: 'get' });

		self.subscription = this.http.get(url, options).pipe(map(res => res.json())).subscribe(
			(data: any) => {
				successFunc(data); // put the data returned from the server in our variable
			},
			(error: any) => {
				self.httpFailure(self, error, errorFunc); // put the data returned from the server in our variable
			},
			() => self.userService.setShowLoading(false) // Code to run in all cases
		);
	}

	httpPost(url, body, successFunc: any, errorFunc: any = null, showModal: boolean = false, isLoginComponent: boolean = false, showGlobalLoading: boolean = true) {
		const self = this;

		this.userService.setShowLoading(true);
		const headers = new Headers({
            'Content-Type': 'application/json',
            //'TimeStamp': new Date().getTime(),
            // 'Accept-Language': this.userLang,
            'Authorization': 'Bearer ' + this.accessToken,
            'X-Pepperi-OwnerID': self.pluginUUID
        });

		const options = new RequestOptions({ headers: headers, method: 'post' });
		this.http.post(url, body, options)
		.pipe(map(res => res.json()))
		.subscribe(// call the post
			(data) => {
				successFunc(data);

			},
			(error) => {
				this.httpFailure(this, error, errorFunc);
			},
			() => this.userService.setShowLoading(false) // Code to run in all cases
		);
	}

	httpDelete(url, successFunc: any, errorFunc: any = null, showModal: boolean = false, isLoginComponent: boolean = false, showGlobalLoading: boolean = true) {
		const headers = new Headers({
			'Content-Type': 'application/json',
			'TimeStamp': new Date().getTime(),
			// 'Accept-Language': this.userLang,
			'Authorization': 'Bearer ' + this.accessToken
		});

		const options = new RequestOptions({ headers: headers, method: 'delete' });
		const self = this;
		this.http.delete(url, options)
			.subscribe((data) => {
					successFunc(data); // put the data returned from the server in our variable
				}
			);
	}

	httpFailure(self, error, errorFunc: any = null) {
		self.userService.setShowLoading(false);
		const title = self.userService.translate.instant('Error');
        const actionButtons = [{ title: 'Ok', callback: null, icon: '' }];
        const errorCode = error && error._body ? JSON.parse(error._body).fault.detail.errorcode : 'General';
        let errorToTranslate = 'Scheduler_Errors_ErrorCode_';
        errorToTranslate += errorCode != '' ? errorCode : 'General' ;
		let content = self.userService.translate.instant(errorToTranslate);
		const data = new DialogData(title, content, DialogDataType.Text, );
		self.userService.openDialog(data);
		if(errorFunc) {
			errorFunc(error);
		}
	  }

    getList(listType = '', ListCustomizationParams ='', listTabName ='', indexStart: number = 0
    , indexEnd: number =100, searchTxt = '', func = null, additionalFilter: string = '', showGlobalLoading: boolean = true
    , useWebWorker: boolean = false, dateFilter: string = '') {
		var self = this;
		let body = JSON.stringify({
			ListType: listType,
			// ListCustomizationParams: '{"Prefix":"CodeJob","Path":"code_jobs","AdditionalApiNames":["ModificationDateTime","CreationDateTime"]}',
			// ListTabName: '[GL#dff55bbc-a623-43be-ada5-b88173f56a48]ListView',
			ListCustomizationParams: ListCustomizationParams,
			ListTabName: listTabName,
			IndexStart: indexStart,
			IndexEnd: indexEnd,
			OrderBy: 'CreationDateTime',
			Ascending: false,
			SearchText: typeof searchTxt ===  'object' ? searchTxt['Value'] : searchTxt,
			SmartSearch: [],
			AdditionalFilter: additionalFilter,
			RetrieveCount: true,
			DateFilter: dateFilter,
			RetrieveDeleted: false
		});

		this.userService.httpPost(
			'Service1.svc/v1/list/' + listType + '/Search',
			body,
			function(res) {
				func(res);


			},
			null,
			true,
			false,
			showGlobalLoading
		);
	}

	updateSystemData(body: any, successFunc, errorFunc = null) {
		this.userService.httpPostApiCall('/addons/installed_addons', body, successFunc, errorFunc, null, true, true);
	}

	// openDialog(title = 'Modal Test', content = PluginDialogComponent, buttons,
	// 		input , callbackFunc, panelClass = 'pepperi-modalbox'): void {
	// 	const self = this;
	// 	const dialogConfig = new MatDialogConfig();
	// 	const data = new DialogModel(title, content, DialogDataType.Component, buttons, input);
	// 	dialogConfig.disableClose = true;
	// 	dialogConfig.autoFocus = false;
	// 	dialogConfig.data = data;
	// 	dialogConfig.panelClass = 'pepperi-permissions-dialog';
	// 	const dialogRef = this.dialog.open(content, dialogConfig);
	// 	dialogRef.afterClosed().subscribe(res => {
	// 			   callbackFunc(res);
  	// 	});
    // }

    updateAdditionalData(additionalData: any, successFunc, errorFunc = null) {
        let body = ({
          "Addon": {"UUID": this.pluginUUID},
          "AdditionalData": JSON.stringify(additionalData)
        });
        this.userService.httpPostApiCall('/addons/installed_addons', body, successFunc, errorFunc, true, true);
    }

    getAddOnsList(func: Function) {
        this.userService.httpGetApiCall(
            '/addons',
            (res: any) => {
                func(res);
            },
            (res: any) => {
                func(res);
            },
            null,
            false,
            true
        );
    }

    getInstalledAddOnsList(func: Function) {
        this.userService.httpGetApiCall(
            '/addons/installed_addons',
            (res: any) => {
                func(res);
            },
            (res: any) => {
                func(res);
            },
            null,
            false,
            false
        );
    }

    getInstalledAddOn(uuid, func: Function) {
        this.userService.httpGetApiCall(
            `/addons/installed_addons/${uuid}`,
            (res: any) => {
                func(res);
            },
            (res: any) => {
                func(res);
            },
            null,
            false,
            false
        );
    }

    isAllowInstallAddon(addonUUID: string, enableKey: string, func: Function) {
        if (enableKey && enableKey.length > 0) {
            this.userService.httpGetApiCall(
                '/company/flags/' + enableKey,
                (res: any) => {
                    func(res);
                },
                (res: any) => {
                    func(false);
                },
                null,
                false,
                false
            );
        } else {
            func(true);
        }
    }

    editAddon(action = '', addonUUID = null, successFunc: Function = null, errorFunc = null, version = '') {
        this.userService.setShowLoading(true);
        // const ver = action === 'upgrade' ? `/${version}` : '' ;
        let body = {
            UUID: addonUUID,
            Version: version
        }
        let url = ''
        if (version) {
            url = `/addons/installed_addons/${addonUUID}/${action}/${version}`;
            body.Version = version
        }
        else {
            url = `/addons/installed_addons/${addonUUID}/${action}`;
        }
        this.userService.httpPostApiCall( url, body, successFunc,
            error => {
                debugger
            }
            , null, true, true);


        // if (version) {
        //     body.Version = version
        // }
        // url = `http://localhost:4400/api/${action}`;
        // return this.http2.post(url, body, { 'headers': {'Authorization': 'Bearer ' + this.userService.getUserToken() }}).subscribe(
        //         res => successFunc(res),
        //         error => errorFunc(error),
        //         () => this.userService.setShowLoading(false)
        //     );


    }

    deleteAddon(addonUUID: string, func: Function) {
        const url = `/addons/installed_addons/${addonUUID}/install`;

        this.userService.httpGetApiCall(
            url,
            (res: any) => {
                func(res);
            },
            (res: any) => {
                func(res);
            },
            null,
            true,
            true,
            'DELETE'
        );
    }

    downloadAddonFiles(addonId: string, versionId: string, func: Function) {
        const url = '/addons/' + addonId + '/versions/' + versionId;

        this.userService.httpGetApiCall(
            url,
            (res: any) => {
                func(res);
            },
            (res: any) => {
                func(res);
            },
            null,
            true,
            true
        );
    }




    // installUIControls() {
    //     let self = this;
    //     let url = location.hostname.indexOf('localhost') > -1 ? "http://localhost:4300/assets/plugins/" : EnvVariables.GlobalAssetsDomain + '/';
    //     url += self.pluginUUID + '/' + self.version + '/' + "UIControls.txt"

    //     self.userService.setShowLoading(true);
    //     const options = new RequestOptions({method: 'get' });

	// 	self.subscription = this.http.get(url, options).pipe(map(res => res.json())).subscribe(
	// 		(data: any) => {
    //             self.createUIControls(data);
	// 		},
	// 		(error: any) => {
	// 			self.httpFailure(self, error); // put the data returned from the server in our variable
	// 		},
	// 		() => self.userService.setShowLoading(false) // Code to run in all cases
	// 	);

    // }

    // createUIControls(UIControls: string) {
    //     let url = this.apiBaseURL + "/meta_data/data_views";
    //     this.httpPost(url, UIControls, (res)=> {
    //         console.log(res);
    //     },
    //     (error) => {
    //         console.log(error);
    //     });
    // }

    getAddons(searchObject: AddonsListSearch, successFunc, errorFunc) {
        this.userService.setShowLoading(true);
        const endpoint = searchObject.ListType === 'all' ? 'addons' : 'updates';

        // --- Work live in sandbox upload api.js file to plugin folder
        // const url = `/addons/api/${searchObject.UUID}/client_events/test`;
        // this.userService.httpGetApiCall(url, successFunc, errorFunc);


        // --- Work localhost
        const url = `http://localhost:4400/client_events/test`;
        this.http2.post(url, searchObject, { 'headers': {'Authorization': 'Bearer ' + this.userService.getUserToken() }}).subscribe(
            res => successFunc(res), error => errorFunc(error), () => this.userService.setShowLoading(false)
        );
    }

    getAddonVersions(uuid, successFunc, errorFunc){
        this.userService.setShowLoading(true);
        // const endpoint = searchObject.ListType === 'all' ? 'addons' : 'updates';
        // --- Work live in sandbox upload api.js file to plugin folder
        // const url = `/addons/api/${searchObject.UUID}/api/${endpoint}`;
        // this.userService.httpGetApiCall(url, successFunc, errorFunc);

        // --- Work localhost
        // const url = `http://localhost:4400/api/addon_versions`;
        // this.http2.post(url, {UUID: uuid}, { 'headers': {'Authorization': 'Bearer ' + this.userService.getUserToken() }}).subscribe(
        //     res => successFunc(res),
        //     error => errorFunc(error),
        //     () => this.userService.setShowLoading(false)
        // );
    }

    getExecutionLog(executionUUID, callback){
              const url = `/audit_logs/${executionUUID}`;
        this.userService.httpGetApiCall(url, callback, null);

    }

    setAutomaticUpgrade(uuid, automaticUpgrade, callback){
        this.getInstalledAddOn(uuid, res => {
            if (res) {
                const systemData = JSON.parse(res.SystemData)
                systemData.AutomaticUpgrade = automaticUpgrade.toString()
                const body = {
                    Addon: { UUID: uuid},
                    SystemData: JSON.stringify(systemData)
                }
                this.userService.httpPostApiCall('/addons/installed_addons', body, callback);

            }

        })

    }

    // openDialog(title = 'Modal Test', content, buttons,
    //     input , callbackFunc, panelClass = 'pepperi-modalbox'): void {
    //     const self = this;
    //     const dialogConfig = new MatDialogConfig();
    //     const data = new DialogModel(title, content, DialogDataType.Component, [], input);
    //     dialogConfig.disableClose = true;
    //     dialogConfig.autoFocus = false
    //     dialogConfig.data = data;
    //     dialogConfig.panelClass = 'pepperi-permissions-dialog'
    //     const dialogRef = this.dialog.open(content, dialogConfig);
    //     dialogRef.afterClosed().subscribe(res => {
    //              callbackFunc(res);
    //     });

    // }

    openDialog(data: DialogData, panelClass: string = 'pepperi-standalone', dlgHeight: string = 'auto', dlgMinWidth: string = '0', dlgMaxWidth: string = '100vw', dlgMaxHeight: string = '100vh') {

        const dialogConfig = new MatDialogConfig();
        dialogConfig.maxWidth = dlgMaxWidth;
        dialogConfig.maxHeight = dlgMaxHeight;
        dialogConfig.height = dlgHeight;
        dialogConfig.minWidth = dlgMinWidth;
        // dialogConfig.direction = this.isRTLlang ? 'rtl' : 'ltr';
        dialogConfig.disableClose = false;
        dialogConfig.autoFocus = false;

        // dialogConfig.scrollStrategy = this.overlay.scrollStrategies.noop();

        dialogConfig.data = data;
        dialogConfig.panelClass = ['pepperi-dialog', panelClass];

        const dialogRef = this.dialog.open(GlobalDialogComponent, dialogConfig);

        dialogRef.afterClosed().subscribe(result => {
            if (result && result.callback) {
                result.callback(result);
            }
        });
    }






}


