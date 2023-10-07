import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { RouterModule, Routes } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

const routes: Routes = [
  {
    path: 'business-shield/P1P2P3',
    component: HomeComponent,
    children: [
      {
        path: '',
        redirectTo: 'get-info',
        pathMatch: 'full'
      },
      {
        path: 'get-info',
        loadChildren: () => import('./../business-shield-abse/get-info/get-info.module').then((mod) => mod.GetInfoModule),
      },
      {
        path: 'quotation',
        loadChildren: () =>
          import('./../business-shield-abse/quotation/quotation.module').then((mod) => mod.QuotationModule),
      },
      {
        path: 'customer-details',
        loadChildren: () =>
          import('./../business-shield-abse/customer-details/customer-details.module').then(
            (mod) => mod.CustomerDetailsModule
          ),
      },
      {
        path: 'checkout',
        loadChildren: () => import('./../business-shield-abse/checkout/checkout.module').then((mod) => mod.CheckoutModule),
      },
      {
        path: 'success',
        loadChildren: () => import('../success/success.module').then((mod) => mod.SuccessModule),
      },
      {
        path: 'fail',
        loadChildren: () => import('../fail/fail.module').then((mod) => mod.FailModule),
      },
    ],
  },
  {
    path: 'not-found',
    loadChildren: () =>
      import('pages/not-found/not-found.module').then((mod) => mod.NotFoundModule),
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
    ReactiveFormsModule
  ],
  exports: [HomeComponent],
})
export class HomeModule { }
