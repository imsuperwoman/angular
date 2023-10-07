import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

/*---- NDBX Component ----*/
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxSwipebarModule } from '@aposin/ng-aquila/swipebar';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { DynamicTableSportComponent } from './dynamic-table-sport.component';
import { NxTableModule } from '@aposin/ng-aquila/table';


@NgModule({
  declarations: [DynamicTableSportComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxCheckboxModule,
    NxSwipebarModule,
    NxCopytextModule,
    NxTableModule
  ],
  exports: [DynamicTableSportComponent],
})
export class DynamicTableSportModule { }
