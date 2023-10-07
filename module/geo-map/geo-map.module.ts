import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NxSwitcherModule } from '@aposin/ng-aquila/switcher';
import { GoogleMapsModule } from '@angular/google-maps';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { NxInputModule } from '@aposin/ng-aquila/input';
import { NxGridModule } from '@aposin/ng-aquila/grid';
import { GeoMapComponent } from './geo-map.component';
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';
import { NxCopytextModule } from '@aposin/ng-aquila/copytext';
import { SharedModule } from 'module/shared.module';
import { SharedDialogModule } from "../shared-dialog/shared-dialog.module";

@NgModule({
  declarations: [GeoMapComponent],
  exports: [GeoMapComponent],
  imports: [
    CommonModule,
    NxSwitcherModule,
    GoogleMapsModule,
    NxInputModule,
    FormsModule,
    ReactiveFormsModule,
    NxGridModule,
    NxSpinnerModule,
    NxCopytextModule,
    SharedModule,
    SharedDialogModule
  ]
})
export class GeoMapModule { }
