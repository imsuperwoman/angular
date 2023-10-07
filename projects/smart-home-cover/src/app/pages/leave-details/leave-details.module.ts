import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
    RouterModule.forChild(routes),
    SharedLeaveDetailsModule
  ],
})
export class LeaveDetailsModule { }
