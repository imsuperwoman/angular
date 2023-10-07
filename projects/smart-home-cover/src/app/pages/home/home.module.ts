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
        path: 'get-info',
        loadChildren: () =>
          import('../get-info/get-info.module').then(
            (mod) => mod.GetInfoModule
          ),
      },
      {
        path: 'quotation',
        loadChildren: () =>
          import('../quotation/quotation.module').then(
            (mod) => mod.QuotationModule
          ),
      },
      {
        path: 'customer-details',
        loadChildren: () =>
          import('../customer-details/customer-details.module').then(
            (mod) => mod.CustomerDetailsModule
          ),
      },
      {
        path: 'checkout',
        loadChildren: () =>
          import('../checkout/checkout.module').then(
            (mod) => mod.CheckoutModule
          ),
      },
      {
        path: 'success',
        loadChildren: () =>
          import('../success/success.module').then(
            (mod) => mod.SuccessModule
          ),
      },
      {
        path: 'fail',
        loadChildren: () =>
          import('../fail/fail.module').then(
            (mod) => mod.FailModule
          ),
      },
      {
        path: 'agent-locator',
        loadChildren: () =>
          import('../agent-locator/agent-locator.module').then(
            (mod) => mod.AgentLocatorModule
          ),
      },
      {
        path: 'renewal-form',
        loadChildren: () =>
          import('../renewal-form/renewal-form.module').then(
            (mod) => mod.RenewalFormModule
          ),
      },
      {
        path: 'leave-details',
        loadChildren: () =>
          import('../leave-details/leave-details.module').then((mod) => mod.LeaveDetailsModule),
      },
      {
        path: 'not-found',
        loadChildren: () =>
          import('../../../../../../pages/not-found/not-found.module').then((mod) => mod.NotFoundModule),
      },
    ],
  },
];
@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule
  ],
  exports: [HomeComponent],
})
export class HomeModule { }
