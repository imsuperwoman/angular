import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeavePageDialogComponent } from './leave-page-dialog.component';

/*---- NDBX Component ----*/
import { NxButtonModule } from '@aposin/ng-aquila/button';


@NgModule({
  declarations: [LeavePageDialogComponent],
  imports: [
    CommonModule,
    NxButtonModule
  ],
  exports: [
    LeavePageDialogComponent
  ]
})
export class LeaveDialogModule { }
