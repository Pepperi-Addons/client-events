import { Injectable } from '@angular/core';
import { AddonApiService } from './addon-api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { PapiClient, PepperiObject, ApiFieldObject, DataViewFieldTypes } from '@pepperi-addons/papi-sdk';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  // a map of fields per atd
  fields: { [key: number]: ApiFieldObject[] } = {}

  _atds: PepperiObject[] = []
  async atds(): Promise<PepperiObject[]> {
    if (!this._atds.length) {
      this._atds = await this.papiClient.metaData.pepperiObjects.iter().toArray();
    }
    return this._atds;
  }

  constructor(
    private addonService: AddonApiService,
    private translate: TranslateService,
  ) { }

  get papiClient(): PapiClient {
    return this.addonService.papiClient;
  }

  getEvents(): Observable<any[]> {
    return this.addonService.get(this.addonService.getAddonApiBaseURL() + '/client_events/events').pipe(map(x => x.result));
  }

  getEvent(uuid: string): Observable<any> {
    return this.addonService.get(this.addonService.getAddonApiBaseURL() + `/client_events/events?where=UUID = '${uuid}'`).pipe(map(x => x.result[0]));
  }

  saveEvent(event: any): Observable<any> {
    const url = this.addonService.getAddonApiBaseURL() + '/client_events/events';
    return this.addonService.post(url, event);
  }

  async getAtds(type?: string): Promise<{ [key: string]: number }> {
    return this.atds().then(res => res.filter(
      atd => type ? atd.Type === type : true
    ).reduce(
      (obj, item) => (obj[item.SubTypeName] = parseInt(item.SubTypeID), obj), {}
    ))
  }

  static events: { 
    [key: string]: { 
      types: string[];
      blockExecutions: string[];
      field: boolean;
      fieldFilter?: (field: ApiFieldObject) => boolean;
    } 
  } = {
    OnEnter: {
      types: ['transactions', 'activities', 'contacts'],
      blockExecutions: ['Main'],
      field: false
    },
    TSAButton: {
      types: ['transaction_lines', 'transactions', 'activities', 'contacts'],
      blockExecutions: [],
      field: true,
      fieldFilter: (field) => field.UIType.Name === 'Button'
    },
    UnitsQuantity: {
      types: ['transaction_lines'],
      blockExecutions: [],
      field: true,
      fieldFilter: field => field.FieldID === 'UnitsQuantity' || ['NumberIntegerQuantitySelector', 'NumberRealQuantitySelector'].includes(field.UIType.Name)
    },
    CartPress: {
      types: ['transactions'],
      blockExecutions: ['After'],
      field: false
    },
  }

  getEventsTypes(type: string): { [key: string]: string } {
    const res = {};

    for (const [key, val] of Object.entries(EventsService.events)) {
      if (val.types.includes(type)) {
        res[this.translate.instant(`Event_${key}_Title`)] = key;
      }
    }

    return res;
  }

  getExecutions(event: string): { [key: string]: string } {
    return ['Before', 'Main', 'After']
      .filter(
        item => !(event && EventsService.events[event].blockExecutions.includes(item))
      )
      .reduce((obj, item) => (obj[this.translate.instant(`Execution_${item}_Title`)] = item, obj), {})
  }

  needsFields(event: string) {
    return event && EventsService.events[event].field
  }

  async getFields(event: string, atdId: number) {
    // lazely load fields per atd
    const atd = await this.atds().then(res => res.find(atd => atd.SubTypeID === atdId.toString()));
    if (!this.fields[atdId]) {
      this.fields[atdId] = await this.papiClient.metaData.type(atd.Type).fields.get();
    }

    return this.fields[atdId]
      .filter(EventsService.events[event].fieldFilter)
      .reduce(
        (obj, item) => (obj[item.Label] = item.FieldID, obj), 
        {}
      )
  }
}
