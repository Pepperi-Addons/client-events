import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import ClientApi from '@pepperi-addons/client-api'
import { AddonApiService } from 'src/app/addon-api.service';
import { NGX_MONACO_EDITOR_CONFIG, NgxMonacoEditorConfig } from 'ngx-monaco-editor';
import { AlertData } from 'src/app/shared/entities';

//@ts-ignore
import {EnvVariables} from 'pepperi-environment-variables';
//@ts-ignore
import {DialogData, DialogDataType} from 'pepperi-dialog';
//@ts-ignore
import {AddonService} from 'pepperi-addon-service'

// this get the async function constructor even after transpiling to es2015
const AsyncFunction = eval('Object.getPrototypeOf(async function(){}).constructor');

export function moncaConfigFactory(addonApiService: AddonApiService): NgxMonacoEditorConfig {
  return {
    baseUrl: addonApiService.getAddonStaticFolderURL().slice(0, -1), // configure base path for monaco editor
    onMonacoLoad: async () => {
  
      window.monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
        noSyntaxValidation: false,
        noSemanticValidation: false
      })
  
      window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
        await fetch((await addonApiService.getCPINodeStaticFolderURL()) + 'globals.d.ts').then(res => res.text())
      )

      window.monaco.languages.typescript.javascriptDefaults.addExtraLib(
        'declare const pepperi: typeof ClientApi'
      )
    }
  }
}

@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.scss'],
  providers: [
    {
        provide: NGX_MONACO_EDITOR_CONFIG,
        deps: [AddonApiService],
        useFactory: moncaConfigFactory
    }
  ]
})
export class CodeEditorComponent implements OnInit {
  
  // here we create the client API by providing the bridge to the CPIService
  private pepperi = ClientApi((params) => {
    return this.addonApiService.clientApiCall(params);
  });

  @Input()
  value: string

  @Output()
  valueChange = new EventEmitter<string>();

  editorOptions = {
    theme: "vs-light",
    language: "javascript",
    automaticLayout: true
  };

  constructor(
    private addonApiService: AddonApiService,
    private addonService: AddonService
  ) { }
  
  ngOnInit(): void {
  }

  async run() {
    const a: (...args) => Promise<any> = new AsyncFunction('pepperi', this.value);
    await a(this.pepperi);
  }

  onCodeChange() {
    this.valueChange.emit(this.value);
  }

}
