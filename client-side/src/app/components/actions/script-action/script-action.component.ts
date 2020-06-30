import { Component, OnInit, Input, Output } from '@angular/core';
import ClientApi from '@pepperi-addons/client-api'
import { AddonApiService } from 'src/app/addon-api.service';

@Component({
  selector: 'app-script-action',
  templateUrl: './script-action.component.html',
  styleUrls: ['./script-action.component.scss']
})
export class ScriptActionComponent implements OnInit {

  constructor(
    private addonService: AddonApiService
  ) { }


  @Input()
  @Output()
  action: any

  // here we create the client API by providing the bridge to the CPIService
  private pepperi = ClientApi((params) => {
    return this.addonService.clientApiCall(params);
  });

  ngOnInit(): void {
  }

  editorOptions = {
    theme: "vs-light",
    language: "javascript",
    automaticLayout: true
  };

  async run() {
    // this get the async function constructor even after transpiling to es2015
    let AsyncFunction = eval('Object.getPrototypeOf(async function(){}).constructor');
    const a: (pepperi: any) => Promise<any> = new AsyncFunction('pepperi', this.action.ActionData.Code);
    await a(this.pepperi);
  }

}
