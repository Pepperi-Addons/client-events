import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { PluginService } from 'src/app/plugin.service';
import { ActivatedRoute, Router } from '@angular/router';
import { EventsService } from 'src/app/events.service';
import { PepperiListService, PepperiListContComponent } from '../pepperi-list/pepperi-list.component';
import { Guid } from 'src/app/plugin.model';

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
  providers: [ PluginService ],
})
export class FormViewComponent implements OnInit {

  eventUUID: string = ''
  event: any = {
    Active: true,
    On: {
      Key: '',
      Hook: 'Before'
    },
    Actions: [
      {
        Type: 'Script',
        Active: true,
        ActionData: {
          Code: 'const a = 123;'
        }
      }
    ]
  };

  currentAction: any = undefined;

  @ViewChild('actionsList', { static: false})
  actionsList: PepperiListContComponent
  
  actionListService: PepperiListService = {
    getDataView: () => {
      return {
        Context: {
          Name: '',
          Profile: { InternalID: 0 },
          ScreenSize: 'Landscape'
        },
        Type: 'Grid',
        Title: 'Actions',
        Fields: [
          {
            FieldID: 'Active',
            Type: 'Boolean',
            Title: 'Active',
            Mandatory: false,
            ReadOnly: true
          },
          {
            FieldID: 'Type',
            Type: 'TextBox',
            Title: 'Type',
            Mandatory: false,
            ReadOnly: true
          },
        ],
        Columns: [
          {
            Width: 1
          },
          {
            Width: 15
          },
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
            this.currentAction = this.event.Actions[obj.Index];
          }
        },
        {
          Key: 'Delete',
          Title: 'Delete',
          Filter: (obj) => true,
          Action: (obj) => { 
            this.event.Actions.splice(obj.Index, 1);
            this.actionsList.loadlist('');
          }
        },
        {
          Key: 'Activate',
          Title: 'Activate',
          Filter: (obj) => obj && !obj.Active,
          Action: (obj) => { 
            this.event.Actions[obj.Index].Active = true;
            this.actionsList.loadlist('');
          }
        },
        {
          Key: 'De-Activate',
          Title: 'De-Activate',
          Filter: (obj) => obj && obj.Active,
          Action: (obj) => { 
            this.event.Actions[obj.Index].Active = false;
            this.actionsList.loadlist('');
          }
        },
        {
          Key: 'Insert',
          Title: 'Insert',
          Filter: (obj) => true,
          Action: (obj) => { 
            this.event.Actions.splice(obj.Index + 1, 0, {
              Type: 'Script',
              Active: true,
              ActionData: {
                Code: ''
              }
            })
            this.actionsList.loadlist('');
          }
        },
      ]
    },

    getList: () => {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(this.event.Actions.map((action, i) => {
            return {
              UUID: Guid.newGuid(),
              Type: action.Type,
              Index: i,
              Active: !!action.Active
            }
          }))
        },500)
      })
    }
  }

  selectOptions = {
    displayKey: "description", //if objects array passed which key to be displayed defaults to description
    search: false, //true/false for the search functionlity defaults to false,
    height: 'auto', //height of the list so that if there are more no of items it can show a scroll defaults to auto. With auto height scroll will never appear
    placeholder:'Select', // text to be displayed when no item is selected defaults to Select,
    customComparator: ()=>{}, // a custom function using which user wants to sort the items. default is undefined and Array.sort() will be used in that case,
    limitTo: 10, // a number thats limits the no of options displayed in the UI similar to angular's limitTo pipe
    moreText: 'more', // text to be displayed whenmore than one items are selected like Option 1 + 5 more
    noResultsFound: 'No results found!', // text to be displayed when no items are found while searching
    searchPlaceholder:'Search', // label thats displayed in search input,
    searchOnKey: 'name', // key on which search should be performed this will be selective search. if undefined this will be extensive search on all keys
    clearOnSelection: false, // clears search criteria when an option is selected if set to true, default is false
    inputDirection: 'ltr', // the direction of the search input can be rtl or ltr(default)
  }

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private eventService: EventsService,
    public cd: ChangeDetectorRef,
  ) { 
    this.activatedRoute.queryParams.subscribe(params => {
      this.eventUUID = params['uuid'] || '';

      if (this.eventUUID) {
        this.eventService.getEvent(this.eventUUID).subscribe(event => {
          this.event = event;
        })
      }
    })
  }

  ngOnInit(): void {
  }

  save(back: boolean) {
    this.currentAction = undefined;
    this.eventService.saveEvent(this.event).subscribe(res => {
      if (res.UUID) {
        if (back) {
          this.router.navigate([], {
            queryParams: {
              view: 'list'
            },
            queryParamsHandling: 'merge',
            relativeTo: this.activatedRoute
          })
        }
        else {
          this.router.navigate([], {
            queryParams: {
              uuid: res.UUID
            },
            queryParamsHandling: 'merge',
            relativeTo: this.activatedRoute
          })
        }
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

  tabChanged() {
    this.currentAction = undefined;
  }

}
