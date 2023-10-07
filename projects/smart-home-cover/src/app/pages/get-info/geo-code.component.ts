import { Component, Input, OnInit, } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, ValidatorFn } from "@angular/forms";


@Component({
  selector: 'geo-code',
  templateUrl: './geo-code.component.html'
})
export class GetCodeComponent implements OnInit {
  /*-- GEO Code --*/
  @Input() address!: FormGroup;
  currentLenght!: number;
  add1length!: number;
  unlength!: number;
  addressErrorMsg!: string

  constructor(
  ) { }

  ngOnInit() {
  }
}
