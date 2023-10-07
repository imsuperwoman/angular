import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { FindAgentComponent } from './find-agent.component';

/*---- Shared Custom Components ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';

/*---- NDBX Component ----*/
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { SharedAgentLocatorModule } from 'pages/agent-locator/shared-agent-locator.module';

const routes: Routes = [
  {
    path: '',
    component: FindAgentComponent,
  },
];

@NgModule({
  declarations: [FindAgentComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    ProductStageModule,
    NxFormfieldModule,
    NxCardModule,
    NxProgressStepperModule,
    NxInputModule,
    NxButtonModule,
    SharedAgentLocatorModule
  ]
})
export class FindAgentModule { }
