import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgentRequiredDialogComponent } from './agent-required-dialog.component';

/*---- NDBX Component ----*/
import { NxModalModule } from '@aposin/ng-aquila/modal';
import { NxButtonModule } from '@aposin/ng-aquila/button';

@NgModule({
  declarations: [AgentRequiredDialogComponent],
  imports: [CommonModule, NxModalModule, NxButtonModule],
  exports: [AgentRequiredDialogComponent],
})
export class AgentRequiredDialogModule {}
