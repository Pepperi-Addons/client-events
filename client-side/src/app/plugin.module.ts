import { NgModule  } from '@angular/core';
import { PluginComponent } from './plugin.component';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { MatTabsModule, MatIconModule, MatInputModule, MatCheckboxModule, MatFormFieldModule, MatDialogModule, MatCardModule, MatMenuModule, MatSelectModule } from '@angular/material';
// @ts-ignore
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
// @ts-ignore
// import { PepperiTextareaComponent } from 'pepperi-textarea';
import { DynamicModule, DynamicComponent } from 'ng-dynamic-component';
import { ignoreElements } from 'rxjs/operators';
//@ts-ignore
import {EnvVariables} from 'pepperi-environment-variables';

import { MonacoEditorModule, NgxMonacoEditorConfig } from 'ngx-monaco-editor';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { AddonApiService } from './addon-api.service';
import { PepperiListContComponent } from './components/pepperi-list/pepperi-list.component';
//@ts-ignore
import { UserService } from 'pepperi-user-service';
//@ts-ignore
import { AddonService } from 'pepperi-addon-service';

import {EditDialogComponent } from './components/dialogs/edit-dialog/edit-dialog.component';
import { ChangeVersionDialogComponent } from './components/dialogs/change-version-dialog/change-version-dialog.component';
import { ListViewComponent } from './components/list-view/list-view.component';
import { FormViewComponent } from './components/form-view/form-view.component'
import { EventsService } from './events.service';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { ScriptActionComponent } from './components/actions/script-action/script-action.component';
import { PepperiSelectComponent } from './components/pepperi-select/pepperi-select.component';
import { PepperiTextboxComponent } from './components/pepperi-textbox/pepperi-textbox.component'

const monacoConfig: NgxMonacoEditorConfig  = {
  baseUrl: EnvVariables.AssetsDomain + sessionStorage.getItem('webappDirectory') +'/assets', // configure base path for monaco editor
  onMonacoLoad: async () => {

    window.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSyntaxValidation: false,
      noSemanticValidation: false
    })

    window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
      await fetch('https://cdn.pepperi.com/Addon/Public/02b186b2-4b43-4765-962c-9e02231b5514/0.0.5/types.d.ts').then(res => res.text())
    )
  }
};

@NgModule({
  declarations: [
    PluginComponent,
    PepperiListContComponent,
    EditDialogComponent,
    ChangeVersionDialogComponent,
    ListViewComponent,
    FormViewComponent,
    ScriptActionComponent,
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
    MonacoEditorModule.forRoot(monacoConfig),
    SelectDropDownModule,
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
    EditDialogComponent,
    ChangeVersionDialogComponent
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