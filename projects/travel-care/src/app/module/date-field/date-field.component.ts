import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'date-field',
  templateUrl: './date-field.component.html'
})
export class DateFieldComponent implements OnInit {
  @ViewChild('dateField') dateFieldEle!: ElementRef;
  @Input('label') label: string = '';
  @Input('minDate') minDate: any = '';
  @Input('maxDate') maxDate: any = '';
  @Input('control') control?: any;
  @Input('dateChange') dateChange?: any;
  @Input('keyup') keyup?: any;

  constructor() { }

  ngOnInit(): void {
  }

  datePickerClosed(data: any): void {
    this.dateFieldEle.nativeElement.removeAttribute('readonly');
  }

  datePickerOpened(data: any): void {
    this.dateFieldEle.nativeElement.setAttribute('readonly', 'readonly');
  }
}
