import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { PluginService } from 'src/app/plugin.service';
import { AddonApiService } from 'src/app/addon-api.service';
import { PepperiListService, PepperiListContComponent } from '../pepperi-list/pepperi-list.component';
import { EventsService } from 'src/app/events.service';
import { Router, ActivatedRoute } from '@angular/router';

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
        Title: '',
        Fields: [
          {
            FieldID: 'On.Key',
            Type: 'TextBox',
            Title: 'Event',
            Mandatory: false,
            ReadOnly: true
          },
          {
            FieldID: 'On.Hook',
            Type: 'TextBox',
            Title: 'Hook',
            Mandatory: false,
            ReadOnly: true
          },
          {
            FieldID: 'Active',
            Type: 'Boolean',
            Title: 'Active',
            Mandatory: false,
            ReadOnly: true
          },
        ],
        Columns: [
          {
            Width: 15
          },
          {
            Width: 15
          },
          {
            Width: 5
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
          Key: 'Activate',
          Title: 'Activate',
          Filter: (obj) => { 
            return obj && !obj.Active 
          },
          Action: (obj) => { 
            obj.Active = true;
            this.eventsService.saveEvent(obj).subscribe(res => {
              this.reload()
            });
          }
        },
        {
          Key: 'De-Activate',
          Title: 'De-Activate',
          Filter: (obj) => { 
            return obj && obj.Active 
          },
          Action: (obj) => { 
            obj.Active = false;
            this.eventsService.saveEvent(obj).subscribe(res => {
              this.reload();
            });
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
