import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicTableComponent } from './dynamic-table.component';
import { ReactiveFormsModule } from '@angular/forms';

/*---- Shared Module ----*/
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { SharedModule } from 'module/shared.module';

/*---- NDBX Component ----*/
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxErrorModule } from '@aposin/ng-aquila/base';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';

@NgModule({
  declarations: [DynamicTableComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxCheckboxModule,
    NxPopoverModule,
    NxButtonModule,
    NxIconModule,
    NxErrorModule,
    NxLinkModule,
    IconPopoverModule,
    NxFormfieldModule,
    NxInputModule,
    NxDropdownModule,
    SharedModule,
    NxMaskModule,
    SharedDialogModule,
  ],
  exports: [DynamicTableComponent],
})
export class DynamicTableModule { }
