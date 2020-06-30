// @ts-nocheck
import { Component, ViewEncapsulation, EventEmitter, Inject, SimpleChanges,
  OnInit, Input,  ComponentRef, ViewChildren, ViewChild, Output, OnDestroy,
  ChangeDetectorRef, ElementRef } from '@angular/core';
import { Location } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { PluginService } from './../../plugin.service';
import { PluginJsonFilter, FooBar } from './../../plugin.model';

// @ts-ignore
import { Subscription, SubscriptionLike, fromEvent } from 'rxjs';
import { DynamicComponent } from 'ng-dynamic-component';

// @ts-ignore
import { PepperiListComponent, VIEW_TYPE } from 'pepperi-custom-list';
// @ts-ignore
import { ObjectSingleData, PepperiRowData, PepperiFieldData, FIELD_TYPE } from 'pepperi-main-service';
// @ts-ignore
import { TopBarComponent, TopBarButton, ICON_POSITION } from 'pepperi-top-bar';
// @ts-ignore
import { ListActionsItem } from 'pepperi-list-actions';
// @ts-ignore
import { AdvanceSearchComponent } from 'pepperi-advanced-search';
// @ts-ignore
import { JsonFilter } from 'pepperi-json-filter';
// @ts-ignore
import { PepperiTextareaComponent } from 'pepperi-textarea';
// @ts-ignore
import { TranslateService } from '@ngx-translate/core';

// @ts-ignore
import { __values } from 'tslib';

// @ts-ignore
import { GridDataView, DataViewFieldTypes } from '@pepperi-addons/papi-sdk'

export interface PepperiListService {
  getDataView(): GridDataView;
  getList(): Promise<any[]>;
  getActions(): {
    Key: string;
    Title: string;
    Filter: (obj: any) => boolean;
    Action: (obj: any) => void;
  }[];
}

@Component({
  selector: 'pep-list',
  templateUrl: './pepperi-list.component.html',
  styleUrls: ['./pepperi-list.component.scss'],
  providers: [ PluginService ]
})
export class PepperiListContComponent implements OnInit {


  @ViewChild('pepperiListCont', { static: false })
  pepperiListCont: ElementRef;
  @ViewChild('pepperiListComp', { static: false })
  pepperiListComp: DynamicComponent;
  @ViewChild('topBarComp', { static: false }) topBarComp: DynamicComponent;
  @ViewChild('pepperiTextareaGeneralComp', { static: false })
  pepperiTextareaGeneralComp: DynamicComponent;
  @ViewChild('pepperiTextareaEmailComp', { static: false })
  pepperiTextareaEmailComp: DynamicComponent;

  @Input() 
  service: PepperiListService;

  list: any[]

  protected paramsSubscription: Subscription;
  protected locationSubscription: SubscriptionLike;

  pepperiListComponent = PepperiListComponent;
  pepperiListInputs;
  pepperiListOutputs;
  topBarComponent = TopBarComponent;
  topBarInputs;
  topBarOutputs;

  pepperiTextareaGeneralComponent = PepperiTextareaComponent;
  pepperiTextareaGeneralInputs;
  pepperiTextareaGeneralOutputs;

  pepperiTextareaEmailComponent = PepperiTextareaComponent;
  pepperiTextareaEmailInputs;
  pepperiTextareaEmailOutputs;

  listActions: Array<ListActionsItem> = null;
  currentList = {ListType: '', ListCustomizationParams: '', ListTabName: '',  ListFilterStr: ''};

  totalRows = 0;
  view: any;
  installing = false;
  listFilter: PluginJsonFilter;
  jsonDateFilter: JsonFilter;
  searchString = '';
  translateKeys = [];
  translations = {};
  updateAvailable = false;
  @Input() apiEndpoint = '';
  foobar: FooBar;
  addonsList = [];
  installedAddonsList = [];
  isSupportUser = '';
  enableAddonAutomaticUpgrade = false;
  currentApiVersion = '';

  constructor(
    public pluginService: PluginService,
    public cd: ChangeDetectorRef,
    public translate: TranslateService,
  ) {

    let userLang = 'en';
    translate.setDefaultLang(userLang);
    userLang = translate.getBrowserLang().split('-')[0]; // use navigator lang if available
    translate.use(userLang);

  }

  ngOnInit(): void {

  }

  pepperiListOnInit(compRef: ComponentRef<any>, apiEndpoint) {
    this.pepperiListInputs = {
      selectionTypeForActions: 1,
      firstFieldAsLink: false,
      listType: '',
      supportSorting: false,
      supportResizing: false,
      noDataFoundMsg: 'No Data Found',
      parentScroll: this.pepperiListCont ? this.pepperiListCont.nativeElement : null,
      top: 0
    };
    this.pepperiListOutputs = {
      notifyListChanged: event => this.onListChange(event),
      notifySortingChanged: event => this.onListSortingChange(event),
      notifyFieldClicked: event => this.onCustomizeFieldClick(event),
      notifySelectedItemsChanged: event => this.selectedRowsChanged(event)
    };

    this.loadlist(apiEndpoint);
  }

  onListChange(event) {

  }

  onListSortingChange(event) {
  }

  onCustomizeFieldClick(event) {
    // debugger;
  }

  selectedRowsChanged(selectedRowsCount) {
    const selectData = this.pepperiListComp.componentRef.instance.getSelectedItemsData(true);
    let rowData = '';
    if (selectData && selectData.rows && selectData.rows[0] !== '' && selectData.rows.length == 1) {

      const uid = selectData.rows[0];
      rowData = this.pepperiListComp.componentRef.instance.getItemDataByID(uid);
    }

    this.listActions = this.topBarComp && selectedRowsCount > 0 ? this.getListActions(rowData) : null;
    this.topBarComp.componentRef.instance.listActionsData = this.listActions;
    this.topBarComp.componentRef.instance.showListActions = this.listActions && this.listActions.length ? true : false;

    this.cd.detectChanges();
  }

  topBarOnInit(compRef: ComponentRef<any>) {
    this.translate.get(['AddonManager_All', 'AddonManager_Updates']).subscribe(translatedValues => {
        const topTitle = this.apiEndpoint === 'all' ? 'AddonManager_All' : 'AddonManager_Updates';

        const topbarTitle = '';
        const topBarInstance = compRef.instance;
        const topRightButtons = [];
        const topLeftButtons = [];

        this.listActions = this.getListActions();
        this.topBarInputs = {
          showSearch: false,
          selectedList: '',
          listActionsXDirection: 'after',
          listActionsData: this.listActions,
          leftButtons: topLeftButtons,
          rightButtons: topRightButtons,
          showTotals: false,
          showListActions: false,
          topbarTitle: translatedValues[topTitle],
          standalone: true
        };

        this.topBarOutputs = {
          actionClicked: event => this.onActionClicked(event),
          jsonDateFilterChanged: event =>  this.onJsonDateFilterChanged(event),
          searchStringChanged: event => this.searchChanged(event)
        };
    });

  }

  getListActions(rowData = null): Array<ListActionsItem> {
    let obj = undefined;
    if (rowData) {
      // todo get by UID once alon adds this
      // obj = this.list.find(item => item.UUID === rowData.UID)
      obj = this.list[0];
    }
    return this.service.getActions().filter(action => action.Filter(obj)).map(action => {
      return new ListActionsItem(action.Key, action.Title, false);
    })
  }

  getValue(object: any, apiName: string): string {
    if (!apiName) {
        return '';
    }

    if (typeof object !== 'object') {
        return '';
    }

    // support regular APINames & dot anotation
    if (apiName in object) {
        return object[apiName].toString();
    }

    // support nested object & arrays
    const arr = apiName.split('.');
    return this.getValue(object[arr[0]], arr.slice(1).join('.'));
  } 

  async loadlist(apiEndpoint) {
    const dataView = this.service.getDataView();
    this.list = await this.service.getList();
    const rows: PepperiRowData[] = this.list.map(x => {
      const res = new PepperiRowData();
      res.Fields = dataView.Fields.map((field, i) => {
        return {
          ApiName: field.FieldID,
          Title: field.Title,
          XAlignment: 1,
          FormattedValue: this.getValue(x, field.FieldID),
          Value:  this.getValue(x, field.FieldID),
          ColumnWidth: dataView.Columns[i].Width,
          AdditionalValue: '',
          OptionalValues: [],
          FieldType: DataViewFieldTypes[field.Type]
        }
      })
      return res;
    });

    const pepperiListObj = this.pluginService.pepperiDataConverter.convertListData(rows);
    const uiControl = pepperiListObj.UIControl;
    const l = pepperiListObj.Rows.map((row) => {
      const osd = new ObjectSingleData(uiControl, row);
      osd.IsEditable = false;
      return osd;
    })

    this.pepperiListComp.componentRef.instance.initListData(uiControl, l.length, l, VIEW_TYPE.Table, '', true);
  }

  onActionClicked(event) {

    const selectData = this.pepperiListComp.componentRef.instance.getSelectedItemsData(true);
    if (selectData.rows.length == 1) {

      const uid = selectData.rows[0];
      const rowData = this.pepperiListComp.componentRef.instance.getItemDataByID( uid );
      // todo get by UID once alon adds this
      // const obj = this.list.find(item => item.UUID === rowData.UID)
      const obj = this.list[0];
      this.service.getActions().find(action => action.Key === event.ApiName).Action(rowData);
    }
  }

  onJsonDateFilterChanged(jsonFilterObject: JsonFilter) {
    this.jsonDateFilter = jsonFilterObject;
    
  }

  public searchChanged(searchString: string) {
    //   debugger;
      this.searchString = searchString;
      
  }
}
