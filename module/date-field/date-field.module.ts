import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DateFieldComponent } from './date-field.component';
import { BlockInputDirective } from 'directives/blockInput.directive';

/*---- NDBX Component ----*/
import { NxDatefieldModule, NxNativeDateModule } from '@aposin/ng-aquila/datefield';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxInputModule } from '@aposin/ng-aquila/input';

@NgModule({
  declarations: [DateFieldComponent, BlockInputDirective],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxDatefieldModule,
    NxNativeDateModule,
    NxFormfieldModule,
    NxInputModule,
  ],
  exports: [DateFieldComponent],
})
export class DateFieldModule {}
