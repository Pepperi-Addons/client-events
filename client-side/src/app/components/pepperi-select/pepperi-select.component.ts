import { Component, OnInit, Input, Output, OnChanges, SimpleChanges, EventEmitter } from '@angular/core';

// @ts-ignore
import { PepperiSelectComponent as PepperiSelectComp } from 'pepperi-select';

@Component({
  selector: 'pepperi-select',
  template: `<ndc-dynamic #comp
  [ndcDynamicComponent]="component"
  [ndcDynamicInputs]="inputs"
  [ndcDynamicOutputs]="outputs">
</ndc-dynamic>`,
  styles: []
})
export class PepperiSelectComponent implements OnInit, OnChanges {

  constructor() { }

  component = PepperiSelectComp
  inputs = {}
  outputs = {
    valueChanged: (event: any) => {
      this.value = this.options[event.value];
      this.valueChange.emit(this.value);
    }
  }

  ngOnInit(): void {
    this.setInputs()
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.setInputs()
  }

  setInputs() {
    this.inputs = {
      key: '',
      label: this.label,
      value: Object.keys(this.options).find(key => this.options[key] === this.value),
      options: Object.keys(this.options).map(val => { return { Key: val, Value: val } }),
      emptyOption: this.emptyOption,
      disabled: this.disabled,
      required: this.required,
    }
  }

  @Input()
  value: any = ''

  @Output()
  valueChange = new EventEmitter<any>();

  @Input()
  options: any = {}

  @Input()
  label: string = ''

  @Input()
  emptyOption: boolean = false;

  @Input()
  disabled: boolean = false

  @Input()
  required: boolean = false
};