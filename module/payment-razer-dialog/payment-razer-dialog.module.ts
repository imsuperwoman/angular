import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PaymentRazerDialogComponent } from './payment-razer-dialog.component';

/*---- NDBX Component ----*/
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';

@NgModule({
  declarations: [PaymentRazerDialogComponent],
  imports: [CommonModule, NxModalModule, NxButtonModule, NxIconModule, NxCheckboxModule,],
  exports: [PaymentRazerDialogComponent],
})
export class PaymentRazerDialogModule { }
