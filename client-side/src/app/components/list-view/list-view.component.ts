import { Component, OnInit, Input } from '@angular/core';
import { PluginService } from 'src/app/plugin.service';
import { AddonApiService } from 'src/app/addon-api.service';
import { PepperiListService } from '../pepperi-list/pepperi-list.component';

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
          Key: 'Activate',
          Title: 'Activate',
          Filter: (obj) => { 
            return obj && !obj.Active 
          },
          Action: (obj) => { console.log('activate') }
        },
        {
          Key: 'De-Activate',
          Title: 'De-Activate',
          Filter: (obj) => { 
            return obj && obj.Active 
          },
          Action: (obj) => { console.log('de-activate') }
        }
      ]
    },

    getList: async () => {
      return new Promise((resolve, reject) => {
        this.addonApiService.get(this.addonApiService.getAddonApiBaseURL() + '/client_events/events').subscribe(res => {
          resolve(res.result);
        })
      })
    }
  }

  constructor(
    private addonApiService: AddonApiService
  ) { }

  ngOnInit(): void {
  }

}
