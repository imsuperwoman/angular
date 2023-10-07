import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'get-info',
        pathMatch: 'full'
      },
      {
        path: 'leave-details',
        loadChildren: () =>
          import('../leave-details/leave-details.module').then((mod) => mod.LeaveDetailsModule),
      },
      {
        path: 'fail',
        loadChildren: () => import('../fail/fail.module').then((mod) => mod.FailModule),
      },
      {
        path: 'success',
        loadChildren: () => import('../success/success.module').then((mod) => mod.SuccessModule),
      },
      {
        path: 'checkout',
        loadChildren: () => import('../checkout/checkout.module').then((mod) => mod.CheckoutModule),
      },
      {
        path: 'find-agent',
        loadChildren: () => import('../find-agent/find-agent.module').then((mod) => mod.FindAgentModule),
      },
      {
        path: 'quotation',
        loadChildren: () => import('../quotation/quotation.module').then((mod) => mod.QuotationModule),
      },
      {
        path: 'vehicle-owner-details',
        loadChildren: () => import('../vehicle-owner-details/vehicle-owner-details.module').then((mod) => mod.VehicleOwnerDetailsModule),
      },
      {
        path: 'get-info',
        loadChildren: () => import('../get-info/get-info.module').then((mod) => mod.GetInfoModule),
      },
      {
        path: 'policyholder-details',
        loadChildren: () => import('../policyholder-details/policyholder-details.module').then((mod) => mod.PolicyholderDetailsModule),
      },
    ],
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('../../../../../../pages/not-found/not-found.module').then((mod) => mod.NotFoundModule),
  },
  {
    path: '**',
    redirectTo: 'not-found',
  },
];


@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
  ],
  exports: [HomeComponent],
})
export class HomeModule { }
