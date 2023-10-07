import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentDialogComponent } from './payment-dialog.component';

/*---- NDBX Component ----*/
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';

@NgModule({
  declarations: [PaymentDialogComponent],
  imports: [CommonModule, NxModalModule, NxButtonModule, NxIconModule, NxCheckboxModule,],
  exports: [PaymentDialogComponent],
})
export class PaymentDialogModule { }
