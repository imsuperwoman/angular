import { DecimalPipe } from '@angular/common';
import { Directive, ElementRef, Injector, Input, OnInit, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[decimalConverter]',
  host: {
    '(focus)': 'onFocus()',
    '(blur)': 'onBlur()',
    '(keydown)': 'onKeydown($event)',
  },
  providers: [DecimalPipe],
})
export class DecimalConverterDirective implements OnInit {
  @Input() decimalPoint?: string = '0';
  controlValue?: number;
  decimalPipe?: DecimalPipe;
  value?: any = '';
  onFocusing: boolean = false;

  constructor(
    private control: NgControl,
    private injector: Injector,
    private renderer: Renderer2,
    private elementRef: ElementRef
  ) { }

  ngOnInit(): void {
    this.decimalPipe = this.injector.get(DecimalPipe);

    if (this.control.value) {
      this.controlValue = parseInt(this.control.value.toString().replace(/,/g, ''));

      this.renderer.setAttribute(this.elementRef.nativeElement, 'type', 'text');
      let controlString = this.decimalPipe?.transform(this.controlValue, `1.${this.decimalPoint}-2`);
      this.control.control?.setValue(controlString);
    }

    this.control.valueChanges?.subscribe((value: number | undefined) => {
      if (value) {
        this.controlValue = value;
      }
    })
  }

  onFocus() {
    this.onFocusing = true;
    if (this.controlValue && this.control.value !== '') {
      this.control.control?.setValue(parseInt(this.controlValue.toString().replace(/,/g, '')));
    }
    this.renderer.setAttribute(this.elementRef.nativeElement, 'type', 'number');
  }

  onBlur() {
    this.onFocusing = false;

    if (this.control.value !== '') {
      this.controlValue = parseInt(this.control.value.toString().replace(/,/g, ''));

      this.renderer.setAttribute(this.elementRef.nativeElement, 'type', 'text');
      let controlString = this.decimalPipe?.transform(this.controlValue, `1.${this.decimalPoint}-2`);
      this.control.control?.setValue(controlString);
    }
  }

  onKeydown(event?: any) {
    if (this.control.name !== 'SumInsured' || this.control.value === null) return;

    if (parseInt(this.control.value.toString().replace(/,/g, '')) > 1000000) {
      if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) {
        event.preventDefault();
      }
    }
  }
}
