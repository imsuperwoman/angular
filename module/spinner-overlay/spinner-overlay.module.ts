import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerOverlayComponent } from './spinner-overlay.component';

/*---- NDBX Component ----*/
import { NxSpinnerModule } from '@aposin/ng-aquila/spinner';

@NgModule({
  declarations: [SpinnerOverlayComponent],
  imports: [CommonModule, NxSpinnerModule],
  exports: [SpinnerOverlayComponent],
})
export class SpinnerOverlayModule {}
