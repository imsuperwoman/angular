import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomFieldsComponent } from './custom-fields.component';
import { ReactiveFormsModule } from '@angular/forms';
import { environment } from 'environments/environment';

/*---- Shared Custom Component ----*/
import { ProductStageModule } from 'module/product-stage/product-stage.module';
import { SharedModule } from 'module/shared.module';
import { IconPopoverModule } from 'module/icon-popover/icon-popover.module';

/*---- NDBX Component ----*/
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxLinkModule } from '@aposin/ng-aquila/link';

@NgModule({
  declarations: [CustomFieldsComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IconPopoverModule,
    NxInputModule,
    NxFormfieldModule,
    NxButtonModule,
    ProductStageModule,
    NxDropdownModule,
    NxCheckboxModule,
    SharedModule,
    NxLinkModule
  ],
  exports: [CustomFieldsComponent],
})
export class CustomFieldsModule { }
