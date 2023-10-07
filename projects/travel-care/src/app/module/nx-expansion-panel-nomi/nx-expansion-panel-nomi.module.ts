import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'module/shared.module';

/*---- NDBX Component ----*/
import { NxExpansionPanelNomiComponent } from './nx-expansion-panel-nomi.component';
import { NxAccordionModule } from '@aposin/ng-aquila/accordion';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxFormfieldModule } from '@aposin/ng-aquila/formfield';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { NxMaskModule } from '@aposin/ng-aquila/mask';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxHeadlineModule } from '@aposin/ng-aquila/headline';
import { NxGridModule } from '@aposin/ng-aquila/grid';


@NgModule({
  declarations: [NxExpansionPanelNomiComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NxAccordionModule,
    NxIconModule,
    NxFormfieldModule,
    NxDropdownModule,
    NxMaskModule,
    NxInputModule,
    SharedDialogModule,
    NxButtonModule,
    SharedModule,
    NxLinkModule,
    NxHeadlineModule,
    NxGridModule
  ],
  exports: [NxExpansionPanelNomiComponent],
})
export class NxExpansionPanelNomiModule { }
