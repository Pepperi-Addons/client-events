import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild, OnChanges, SimpleChanges } from '@angular/core';
import { PluginService } from 'src/app/plugin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/events.service';
import { Guid } from 'src/app/plugin.model';
import { TranslateService } from '@ngx-translate/core';
import ClientApi from '@pepperi-addons/client-api'
import { AddonApiService } from 'src/app/addon-api.service';
import { PepperiObject, DataViewFieldType } from '@pepperi-addons/papi-sdk';
import { filter } from 'rxjs/operators';
import { Event } from '../../shared/entities';

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
  providers: [ PluginService ],
})
export class FormViewComponent implements OnInit {

  loading = true;
  eventUUID: string = ''
  event: Event;
  
  editorOptions = {
    theme: "vs-light",
    language: "javascript",
    automaticLayout: true
  };
  
  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventService: EventsService,
    private addonService: AddonApiService,
    private translate: TranslateService,
    private cd: ChangeDetectorRef
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.eventUUID = params['uuid'] || '';

      if (this.eventUUID) {
        this.eventService.getEvent(this.eventUUID).subscribe(event => {
          this.event = event;
          this.updateOptions();
          this.loading = false;
          this.cd.detectChanges();
        })
      }
      else {
        this.loading = false;
        this.event = {
          UUID: '',
          CreationDate: '',
          ModificationDate: '',
          Hidden: false,
          Active: true,
          Description: '',
          On: {
            Key: undefined,
            Hook: 'Before',
            Object: {
              Resource: 'transactions',
              InternalID: 0,
              Name: ''
            },
            Field: {
              FieldID: '',
              Name: ''
            },
          },
          Action: {
            Type: 'Script',
            Code: "console.log('hello world!!')"
          }
        };
        this.updateOptions();
      }
    })
  }

  ngOnInit(): void {
  }

  save() {
    this.eventService.saveEvent(this.event).subscribe(res => {
      if (res.UUID) {
        this.router.navigate([], {
          queryParams: {
            view: 'list'
          },
          queryParamsHandling: 'merge',
          relativeTo: this.activatedRoute
        })
      }
    })
  }

  cancel() {
    this.router.navigate([], {
      queryParams: {
        view: 'list',
        uuid: '',
      },
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute
    })
  }

  // here we create the client API by providing the bridge to the CPIService
  private pepperi = ClientApi((params) => {
    return this.addonService.clientApiCall(params);
  });

  async run() {
    // this get the async function constructor even after transpiling to es2015
    let AsyncFunction = eval('Object.getPrototypeOf(async function(){}).constructor');
    const a: (pepperi: any) => Promise<any> = new AsyncFunction('pepperi', this.event.Action.Code);
    await a(this.pepperi);
  }

  options = {
    eventOptions: {},
    activeOptions: {
      Yes: true,
      No: false
    },
    fieldOptions: {},
    objectOptions: {
      Activity: 'activities',
      Transaction: 'transactions',
      'Transaction Lines': 'transaction_lines'
    },
    atdOptions: {},
    executionOptions: {},
    fieldsEnabled: false
  }

  async updateOptions() {

    this.options.eventOptions = this.eventService.getEventsTypes(this.event.On.Object.Resource);

    this.options.executionOptions = this.eventService.getExecutions(this.event.On.Key);

    this.options.fieldsEnabled = this.event.On.Object.InternalID && this.eventService.needsFields(this.event.On.Key);

    this.eventService.getAtds(this.event.On.Object.Resource).then(res => {
      this.options.atdOptions = res;
    })

    if (this.options.fieldsEnabled) {
      this.eventService.getFields(this.event.On.Key, this.event.On.Object.InternalID).then((res) => {
        this.options.fieldOptions = res
      })
    }
  }

  objectChanged() {
    this.event.On.Object.InternalID = 0;
    this.event.On.Key = '';
    this.event.On.Field = {
      FieldID: '',
      Name: ''
    };
    this.updateOptions()
  }

  atdChanged() {
    this.event.On.Field = {
      FieldID: '',
      Name: ''
    };
    this.updateOptions()
  }

  eventChanged() {
    this.event.On.Field = {
      FieldID: '',
      Name: ''
    };
    this.updateOptions()
  }
}
