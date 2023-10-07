import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'accordion-indicator',
  templateUrl: './accordion-indicator.component.html',
  styleUrls: ['./accordion-indicator.component.scss'],
})
export class AccordionIndicatorComponent implements OnInit {
  @Input('control') control!: AbstractControl;
  
  constructor() {}

  ngOnInit(): void {}
}
