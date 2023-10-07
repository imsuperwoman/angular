import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Component ----*/
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';

/*---- NDBX Component ----*/
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';

@NgModule({
  declarations: [DynamicTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconPopoverModule,
    NxFormfieldModule,
    NxCheckboxModule,
    NxPopoverModule,
    NxButtonModule,
    NxIconModule,
    NxErrorModule,
    NxDropdownModule
  ],
  exports: [DynamicTableComponent],
})
export class DynamicTableModule { }
