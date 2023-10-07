import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/*---- NDBX Component ----*/
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxSwipebarModule } from '@aposin/ng-aquila/swipebar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { DynamicTableMountComponent } from './dynamic-table-mount.component';
import { NxTableModule } from '@aposin/ng-aquila/table';
import { NxRadioModule } from '@aposin/ng-aquila/radio-button';


@NgModule({
  declarations: [DynamicTableMountComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxCheckboxModule,
    NxSwipebarModule,
    NxCopytextModule,
    NxTableModule,
    NxRadioModule
  ],
  exports: [DynamicTableMountComponent],
})
export class DynamicTableMountModule { }
