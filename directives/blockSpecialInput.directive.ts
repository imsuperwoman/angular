import { Directive, ElementRef, Input, OnInit } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[blockSpecialInput]',
  host: {

    '(keypress)': 'onKeyPress($event)',
  },
})
export class BlockSpecialDirective {

  onKeyPress(event?: any) {
    let e = event.keyCode;
    let specialChars = [13];

    if (specialChars.includes(e)) {
      event.preventDefault();
    } else {
      return;
    }
  }
}
