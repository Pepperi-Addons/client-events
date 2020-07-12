import { NgModule  } from '@angular/core';
import { PluginComponent } from './plugin.component';
import { CommonModule } from '@angular/common';
import { MatTabsModule, MatIconModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatDialogModule, MatCardModule, MatSelectModule } from '@angular/material';
// @ts-ignore
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DynamicModule, DynamicComponent } from 'ng-dynamic-component';
//@ts-ignore
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AddonApiService } from './addon-api.service';
import { PepperiListContComponent } from './components/pepperi-list/pepperi-list.component';
//@ts-ignore
import { UserService } from 'pepperi-user-service';
import { MonacoEditorModule } from 'ngx-monaco-editor';
import { ListViewComponent } from './components/list-view/list-view.component';
import { FormViewComponent } from './components/form-view/form-view.component'
import { EventsService } from './events.service';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { CodeEditorComponent } from './components/code-editor/code-editor.component'
import { PepperiSelectComponent } from './components/pepperi-select/pepperi-select.component';
import { PepperiTextboxComponent } from './components/pepperi-textbox/pepperi-textbox.component'

@NgModule({
  declarations: [
    PluginComponent,
    PepperiListContComponent,
    ListViewComponent,
    FormViewComponent,
    CodeEditorComponent,
    PepperiSelectComponent,
    PepperiTextboxComponent,
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    MatTabsModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatDialogModule,
    MatCardModule,
    TranslateModule.forRoot({
        loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient, UserService]
        }
    }),
    FormsModule,
    ReactiveFormsModule,
    DynamicModule.withComponents([]),
    MatSelectModule,
    SelectDropDownModule,
    MonacoEditorModule
    ],
  exports: [

  ],
  providers: [{
    provide: 'plugins',
    useValue: [{
      name: 'plugin-component',
      component: PluginComponent
    }],
    multi: true
  },
  AddonApiService,
  HttpClient,
  EventsService
],
  entryComponents: [
    PluginComponent,
    DynamicComponent,
  ]
})

export class PluginModule {

}

export function createTranslateLoader(http: HttpClient, userService: UserService, url: string = '') {
  if (!url) {
    url = userService.getAddonStaticFolder();
    return new TranslateHttpLoader(http, url , '.json');
  }
}