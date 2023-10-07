import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { PolicyholderDetailsComponent } from './policyholder-details.component';

/*---- Shared Custom Component ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { QuotationSummaryCardModule } from 'module/quotation-summary-card/quotation-summary-card.module';
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';
import { SharedModule } from 'module/shared.module';
import { AccordionIndicatorModule } from 'module/accordion-indicator/accordion-indicator.module';

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
import { DateFieldModule } from 'module/date-field/date-field.module';
import { NxRadioToggleModule } from '@aposin/ng-aquila/radio-toggle';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';
import { NxRadioModule } from '@aposin/ng-aquila/radio-button';

const routes: Routes = [
  {
    path: '',
    component: PolicyholderDetailsComponent,
  },
];

@NgModule({
  declarations: [PolicyholderDetailsComponent],
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
    NxRadioToggleModule,
    AccordionIndicatorModule,
    DateFieldModule,
    SharedModule,
    SharedDialogModule,
    NxRadioModule
  ]
})
export class PolicyholderDetailsModule { }
