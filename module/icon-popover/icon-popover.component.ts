import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'icon-popover',
  templateUrl: './icon-popover.component.html',
  styleUrls: ['./icon-popover.component.scss'],
})
export class IconPopoverComponent implements OnInit {
  @Input('popoverMessage') message: string = '';
  @Input('textAlign') textAlign: string = 'left';
  highlightIcon: boolean = false;

  constructor() {}

  ngOnInit(): void {}

  toggleHighlightIcon(data: boolean) {
    this.highlightIcon = data;
  }
}
