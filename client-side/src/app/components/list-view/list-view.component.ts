import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PluginService } from 'src/app/plugin.service';
import { AddonApiService } from 'src/app/addon-api.service';
import { PepperiListService, PepperiListContComponent } from '../pepperi-list/pepperi-list.component';
import { EventsService } from 'src/app/events.service';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { map, flatMap } from 'rxjs/operators';

@Component({
  selector: 'app-list-view',
  templateUrl: './list-view.component.html',
  styleUrls: ['./list-view.component.scss'],
  providers: [ PluginService ]
})
export class ListViewComponent implements OnInit {
  service: PepperiListService = {
    getDataView: () => {
      return {
        Context: {
          Name: '',
          Profile: { InternalID: 0 },
          ScreenSize: 'Landscape'
        },
        Type: 'Grid',
        Title: this.translate.instant('Events'),
        Fields: [
          {
            FieldID: 'Description',
            Type: 'TextBox',
            Title: this.translate.instant('Description'),
            Mandatory: false,
            ReadOnly: true
          },
          {
            FieldID: 'On.Object.Name',
            Type: 'TextBox',
            Title: this.translate.instant('Type'),
            Mandatory: false,
            ReadOnly: true
          },
          {
            FieldID: 'On.Key',
            Type: 'TextBox',
            Title: this.translate.instant('Event Name'),
            Mandatory: false,
            ReadOnly: true
          },
          {
            FieldID: 'On.Field.Name',
            Type: 'TextBox',
            Title: this.translate.instant('Field Name'),
            Mandatory: false,
            ReadOnly: true
          },
          {
            FieldID: 'Active',
            Type: 'Boolean',
            Title: this.translate.instant('Active'),
            Mandatory: false,
            ReadOnly: true
          },
        ],
        Columns: [
          {
            Width: 10
          },
          {
            Width: 10
          },
          {
            Width: 10
          },
          {
            Width: 10
          },
          {
            Width: 10
          }
        ],
        FrozenColumnsCount: 0,
        MinimumColumnWidth: 0
      }
    },

    getActions: () => {
      return [
        {
          Key: 'Edit',
          Title: 'Edit',
          Filter: (obj) => true,
          Action: (obj) => { 
            this.router.navigate([], {
              queryParams: {
                view: 'form',
                uuid: obj.UUID,
              },
              queryParamsHandling: 'merge',
              relativeTo: this.activatedRoute
            })
          }
        },
        {
          Key: 'Delete',
          Title: 'Delete',
          Filter: (obj) => true,
          Action: (obj) => { 
            obj.Hidden = true;
            this.eventsService.saveEvent(obj).subscribe(res => {
              this.reload();
            });
          }
        },
      ]
    },

    rightButtons: () => {
      return [
        {
          Title: this.translate.instant('Add'),
          Icon: '',
          Action: () => this.add()
        }
      ]
    },

    getList: () => {
      return this.eventsService.getEvents().toPromise();
    }
  }


  @ViewChild('list', { static: false })
  list: PepperiListContComponent

  constructor(
    private eventsService: EventsService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService,
  ) { }

  ngOnInit(): void {
  }

  reload() {
    this.list.loadlist('');
  }

  add() {
    this.router.navigate([], {
      queryParams: {
        view: 'form',
        uuid: '',
      },
      queryParamsHandling: 'merge',
      relativeTo: this.activatedRoute
    })
  }

}
