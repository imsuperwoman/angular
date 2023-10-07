import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { SharedRenewalFormModule } from 'module/renewal-form/shared-renewal-form.module';
import { RenewalFormComponent } from './renewal-form.component';


const routes: Routes = [
  {
    path: '',
    component: RenewalFormComponent,
  },
];

@NgModule({
  declarations: [RenewalFormComponent],
  imports: [
    NxButtonModule,
    RouterModule.forChild(routes),
    SharedRenewalFormModule
  ]
})

export class RenewalFormModule { }
