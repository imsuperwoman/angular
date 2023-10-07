import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DisclosureMessageComponent } from './disclosure-message.component';
import { ReactiveFormsModule } from '@angular/forms';

/*---- NDBX Component ----*/
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxErrorModule } from '@aposin/ng-aquila/base';

@NgModule({
  declarations: [DisclosureMessageComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxCheckboxModule,
    NxPopoverModule,
    NxButtonModule,
    NxIconModule,
    NxErrorModule
  ],
  exports: [DisclosureMessageComponent],
})
export class DisclosureMessageModule { }
