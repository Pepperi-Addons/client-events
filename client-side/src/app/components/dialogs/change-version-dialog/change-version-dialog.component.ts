import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { EditDialogComponent } from '../edit-dialog/edit-dialog.component';
import { DialogModel } from 'src/app/plugin.model';

@Component({
  selector: 'app-change-version-dialog',
  templateUrl: './change-version-dialog.component.html',
  styleUrls: ['./change-version-dialog.component.scss']
})
export class ChangeVersionDialogComponent implements OnInit {


  title;
  dialogData;
  svgIcons;
  selectedVersion
  currentVersion
  automaticUpgrade = false
  callback
  values = []
  version
  outputData = {callback: null, version: ''}
  constructor(private fb: FormBuilder,
      public dialogRef: MatDialogRef<EditDialogComponent>,
      @Inject(MAT_DIALOG_DATA) public incoming: DialogModel) {

      this.title = incoming.title;
      this.dialogData = incoming.contentData.rowData;
      this.outputData.callback = incoming.contentData.callback;
      this.svgIcons = incoming.contentData.svgIcons;
      this.values = incoming.contentData.versions;
      this.currentVersion = incoming.contentData.currentVersion;
 
      // this.dialogData.Fields[2].OptionalValues.forEach(version => { this.values.push({Key: version.Version, Value: version.Version})    
  }

  ngOnInit(): void {
  }

  menuItemClicked(option){

  }

  selectionChange(){

  }

  openedChange(){

  }

}
