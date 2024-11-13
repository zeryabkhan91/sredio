import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  template: `<input type="checkbox" [checked]="params.value" (click)="onInputChange($event)" />`,
})
export class CheckboxComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    this.params = params; 
    return true;
  }

  onInputChange(event: any) {
    const isChecked = event.target.checked;
    this.params.node?.setDataValue('isIncluded', isChecked);
    this.params.context.onIncludeRepo(this.params.data, isChecked);
  }
}
