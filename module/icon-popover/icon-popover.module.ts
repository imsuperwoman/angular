import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconPopoverComponent } from './icon-popover.component';

import { NxPopoverModule } from '@aposin/ng-aquila/popover';
import { NxIconModule } from '@aposin/ng-aquila/icon';

@NgModule({
  declarations: [IconPopoverComponent],
  imports: [CommonModule, NxPopoverModule, NxIconModule],
  exports: [IconPopoverComponent]
})
export class IconPopoverModule {}
