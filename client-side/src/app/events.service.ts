import { Injectable } from '@angular/core';
import { AddonApiService } from './addon-api.service';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(
    private addonService: AddonApiService
  ) { }

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
}
