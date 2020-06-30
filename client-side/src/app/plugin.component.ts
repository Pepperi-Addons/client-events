import {
  Component,
  ViewEncapsulation,
  OnInit,
  OnDestroy
} from "@angular/core";
import { TranslateService } from '@ngx-translate/core';
import { AddonApiService } from './addon-api.service';
import { Router, ActivatedRoute } from '@angular/router';
import { PluginService } from './plugin.service';
import { Observable } from 'rxjs';

@Component({
  selector: "plugin",
  templateUrl: "./plugin.component.html",
  styleUrls: ["./plugin.component.scss"],
  providers: [ AddonApiService, PluginService ]

  ,
  // To override parent component styling
  encapsulation: ViewEncapsulation.None
})
export class PluginComponent implements OnInit {

  view: string;

  constructor(
    public translate: TranslateService,
    public service: AddonApiService,
    public pluginService: PluginService,
    public router: Router,
    private routeParams: ActivatedRoute
  ) {
    let userLang = 'en';
    translate.setDefaultLang(userLang);
    userLang = translate.getBrowserLang().split('-')[0]; // use navigator lang if available
    translate.use(userLang);

    this.routeParams.queryParams.subscribe(params => {
      this.view = params['view'] || 'list';
    })
  }


  ngOnInit() {
  }

  ngOnDestroy() {
  }
  
}
