import { Component, OnInit } from '@angular/core';
import { PluginService } from 'src/app/plugin.service';

@Component({
  selector: 'app-form-view',
  templateUrl: './form-view.component.html',
  styleUrls: ['./form-view.component.scss'],
  providers: [ PluginService ]
})
export class FormViewComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
