import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[inputCapitalization]',
  host: {
    '(change)': 'capitalizeControl()',
  },
})
export class InputCapitalizationDirective implements OnInit {
  @Input('disableCapitalization') disabled!: boolean;
  value!: any;

  constructor(private control: NgControl, private element: ElementRef) {
    element.nativeElement.style.textTransform = 'uppercase';
  }

  ngOnInit(): void { }

  capitalizeControl() {
    let value = this.control.control?.value

    if (this.disabled || !value) return;
    this.control.control?.setValue(this.control.value.toUpperCase());
  }
}
