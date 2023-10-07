import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NxProgressStepperModule } from '@aposin/ng-aquila/progress-stepper';
import { SharedLeaveDetailsModule } from 'pages/leave-details/shared-leave-details.module';
import { LeaveDetailsComponent } from './leave-details.component';

const routes: Routes = [
  {
    path: '',
    component: LeaveDetailsComponent,
  },
];

@NgModule({
  declarations: [LeaveDetailsComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedLeaveDetailsModule,
    NxProgressStepperModule,
  ],
})
export class LeaveDetailsModule { }
