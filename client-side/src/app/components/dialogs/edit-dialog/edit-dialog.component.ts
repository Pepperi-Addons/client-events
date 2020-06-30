import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Component, OnInit, Inject, ViewChild, OnDestroy, Injectable } from '@angular/core';
// @ts-ignore
import { PepperiSelectComponent} from 'pepperi-select';
// @ts-ignore
import { PepperiCheckboxComponent} from 'pepperi-checkbox';
import { DialogModel } from 'src/app/plugin.model';
import { DynamicComponent } from 'ng-dynamic-component';
import { BehaviorSubject } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class EditDialogService {

    private dataSource = new BehaviorSubject<any>('');
    data = this.dataSource.asObservable();

    constructor() { }

    getData(data: any) {
        this.dataSource.next(data);
    }

}
@Component({
  selector: 'edit-dialog',
  templateUrl: './edit-dialog.component.html',
  styleUrls: ['./edit-dialog.component.scss']
})
export class EditDialogComponent implements OnInit, OnDestroy {


    pepperiSelect = PepperiSelectComponent;
    @ViewChild("pepperiSelectTypeComp", {static: false}) pepperiSelectTypeComp: DynamicComponent;
    pepperiSelectTypeInputs;
    pepperiSelectTypeOutputs;
    versions = [];

    pepperiCheckbox = PepperiCheckboxComponent;
    @ViewChild("pepperiCheckboxComp", {static: false}) pepperiCheckboxComp: DynamicComponent;
    pepperiCheckboxInputs;
    pepperiCheckboxOutputs;

    title;
    dialogData;
    svgIcons;
    selectedVersion
    currentVersion
    automaticUpgrade = false
    callback
    outputData = { callback: null, automaticUpgrade: false}

    constructor(private fb: FormBuilder,
        public dialogRef: MatDialogRef<EditDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public incoming: DialogModel) {

        this.title = incoming.title;
        this.dialogData = incoming.contentData.rowData;
        this.outputData.callback = incoming.contentData.callback;
        this.svgIcons = incoming.contentData.svgIcons;
        this.outputData.automaticUpgrade = this.dialogData.Fields[4].FormattedValue === 'true';        
    }

    ngOnInit() {
      
    }

    onConfirm() {
       
        // this.dialogData = { selectedVersion: this.selectedVersion };
    }

    pepperiSelectOnInit(compRef, inputs, outputs, key, label, options, initalValue = null) {
        debugger;
        const self = this;
        this[inputs] = {
            'key': key,
            'label': label,
            'rowSpan': '3',
            'xAlignment': '1',
            'options': options,
            'emptyOption': false,
            'value': initalValue ? initalValue.Key : options[0].Key,
            'formattedValue': initalValue ?  initalValue.Value : options[0].Value,
            'readonly': true
        };

        this.dialogData.selectedVersion = initalValue ? initalValue : options[0];

        this[outputs] = {
            elementClicked: (event) => self.onElementClicked(event),
            valueChanged: (event) => self.onValueChanged(event)
        };
    }

    pepperiCheckboxOnInit(compRef, inputs, outputs, key, label, value) {
        const self = this;
        this[inputs] = {
            key: key,
            label: label,
            rowSpan: '3',
            xAlignment: '1',
            emptyOption: false,
            value: value
        };
        this[outputs] = {
            elementClicked: (event) => self.onElementClicked(event),
            valueChanged: (event) => self.onValueChanged(event)
        };
    }

    onElementClicked(e) {
    }

    onValueChanged(e) {
        switch (e.apiName) {
            case 'ObjectSelect':
                let selectedVersion = this.dialogData.versions.filter(version => version.Key == e.value)[0];
                this.dialogData['selectedVersion'] = selectedVersion;
        }
    }

    ngOnDestroy(){
        this.selectedVersion = null;
        this.dialogData = null;
    }

}
