import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './not-found.component';
import { NxButtonModule } from '@aposin/ng-aquila/button';


const routes: Routes = [
  {
    path: '',
    component: NotFoundComponent,
  },
];

@NgModule({
  declarations: [NotFoundComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    NxButtonModule
  ],
  exports: [NotFoundComponent]
})
export class NotFoundModule { }
