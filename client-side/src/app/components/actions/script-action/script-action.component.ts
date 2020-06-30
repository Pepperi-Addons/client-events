import { Component, OnInit, Input, Output } from '@angular/core';

@Component({
  selector: 'app-script-action',
  templateUrl: './script-action.component.html',
  styleUrls: ['./script-action.component.scss']
})
export class ScriptActionComponent implements OnInit {

  constructor() { }


  @Input()
  @Output()
  action: any

  ngOnInit(): void {
  }

  editorOptions = {
    theme: "vs-light",
    language: "javascript",
    automaticLayout: true
  };

  run() {
    
  }

}
