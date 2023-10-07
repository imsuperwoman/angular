import { Directive, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[blockInput]',
  host: {
    '(keydown)': 'onKeydown($event)',
  },
})
export class BlockInputDirective implements OnInit {
  constructor(private control: NgControl) { }

  ngOnInit(): void { }

  onKeydown(event?: any) {
    let e = event.keyCode;
    let allowKeyCode = [46, 8, 9, 27, 13, 110, 190];

    if (
      allowKeyCode.includes(e) || // Allow: Ctrl+A
      (e === 65 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+C
      (e === 67 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+V
      (e === 86 && (event.ctrlKey || event.metaKey)) ||
      // Allow: Ctrl+X
      (e === 88 && (event.ctrlKey || event.metaKey)) ||
      // Allow: home, end, left, right
      (e >= 35 && e <= 39)
    ) {
      // let it happen, don't do anything
      return;
    } else {
      event.preventDefault();
    }
  }
}
