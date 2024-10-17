import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  standalone: true,
  template: `<input type="checkbox" (click)="onInputChange($event)" />`,
})
export class CheckboxComponent implements ICellRendererAngularComp {
  params: any;

  agInit(params: ICellRendererParams): void {
    this.params = params;
  }

  refresh(params: ICellRendererParams) {
    return true;
  }

  onInputChange(event: any) {
    const isChecked = event.target.checked;
    this.params.context.onIncludeRepo(this.params.data, isChecked);
  }
}
