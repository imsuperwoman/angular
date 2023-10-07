import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionIndicatorComponent } from './accordion-indicator.component';

/*---- NDBX Modules ----*/
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NdbxIconModule } from '@allianz/ngx-ndbx/icon';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AccordionIndicatorComponent],
  imports: [CommonModule, ReactiveFormsModule, NxIconModule, NdbxIconModule],
  exports: [AccordionIndicatorComponent],
})
export class AccordionIndicatorModule {}
