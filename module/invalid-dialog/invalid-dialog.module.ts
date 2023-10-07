import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvalidDialogComponent } from './invalid-dialog.component';

/*---- NDBX Component ----*/
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxButtonModule } from '@aposin/ng-aquila/button';

@NgModule({
  declarations: [InvalidDialogComponent],
  imports: [CommonModule, NxModalModule, NxButtonModule],
  exports: [InvalidDialogComponent],
})
export class InvalidDialogModule { }
