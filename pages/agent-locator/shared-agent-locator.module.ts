import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedAgentLocatorComponent } from './shared-agent-locator.component';
import { ReactiveFormsModule } from '@angular/forms';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';

//ndbx
import { NxButtonModule } from '@aposin/ng-aquila/button';
import { NxIconModule } from '@aposin/ng-aquila/icon';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxCheckboxModule } from '@aposin/ng-aquila/checkbox';
import { NxLinkModule } from '@aposin/ng-aquila/link';
import { NxCardModule } from '@aposin/ng-aquila/card';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxMessageModule } from '@aposin/ng-aquila/message';
import { NxDropdownModule } from '@aposin/ng-aquila/dropdown';
import { SharedModule } from 'module/shared.module';
import { NxTabsModule } from '@aposin/ng-aquila/tabs';
import { SharedDialogModule } from 'module/shared-dialog/shared-dialog.module';

@NgModule({
  declarations: [SharedAgentLocatorComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    GoogleMapsModule,
    NxButtonModule,
    NxDropdownModule,
    NxIconModule,
    NxInputModule,
    NxCheckboxModule,
    NxLinkModule,
    NxCardModule,
    FormsModule,
    NxSpinnerModule,
    NxMessageModule,
    SharedModule,
    NxTabsModule,
    SharedDialogModule
  ],
  exports: [SharedAgentLocatorComponent],
})
export class SharedAgentLocatorModule { }
