import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerTimeoutDialogComponent } from './server-timeout-dialog.component';

/*---- NDBX Component ----*/
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxButtonModule } from '@aposin/ng-aquila/button';

@NgModule({
  declarations: [ServerTimeoutDialogComponent],
  imports: [CommonModule, NxModalModule, NxButtonModule],
  exports: [ServerTimeoutDialogComponent],
})
export class ServerTimeoutDialogModule {}
