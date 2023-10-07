import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { QuotationComponent } from './quotation.component';

/*---- Shared Custom Component ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { SharedModule } from 'module/shared.module';


/*---- NDBX Component ----*/
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NxSwipebarModule } from '@aposin/ng-aquila/swipebar';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxMessageModule } from '@aposin/ng-aquila/message';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { DynamicTableModule } from '../../module/dynamic-table/dynamic-table.module';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';


const routes: Routes = [
  {
    path: '',
    component: QuotationComponent,
  },
];

@NgModule({
  declarations: [QuotationComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ProductStageModule,
    QuotationSummaryCardModule,
    NxSpinnerModule,
    NxIconModule,
    NdbxIconModule,
    NxProgressStepperModule,
    NxButtonModule,
    NxPopoverModule,
    IconPopoverModule,
    NxSwipebarModule,
    NxFormfieldModule,
    NxDropdownModule,
    NxMaskModule,
    NxInputModule,
    NxMessageModule,
    NxAccordionModule,
    SharedModule,
    DynamicTableModule,
    SharedDialogModule
  ]
})
export class QuotationModule { }
