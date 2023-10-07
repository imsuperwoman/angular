import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedDialogComponent } from './shared-dialog.component';

/*---- NDBX Component ----*/
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxButtonModule } from '@aposin/ng-aquila/button';

@NgModule({
  declarations: [SharedDialogComponent],
  imports: [
    CommonModule,
    NxModalModule,
    NxButtonModule
  ],
  exports: [SharedDialogComponent]
})
export class SharedDialogModule { }
