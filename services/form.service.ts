import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {

  constructor() { }

  updateForms(form: any): void {
    let formValue = JSON.stringify(form.getRawValue());
    localStorage.setItem('formValue', formValue);
  }

  getForms(): any {
    let formValue = localStorage.getItem('formValue');
    if (formValue) {
      return JSON.parse(formValue);
    }
  }

  generateControls(formValue: any): any {
    let control: any;
    if (!formValue) {
      control = new UntypedFormControl(formValue);
    } else if (formValue instanceof Array) {
      control = new UntypedFormArray([]);
      formValue.forEach((arrayVal) => {
        control.push(this.generateControls(arrayVal));
      });
    } else if (typeof formValue === 'object') {
      control = new UntypedFormGroup({});
      Object.keys(formValue).forEach((key) => {
        control.addControl(key, this.generateControls(formValue[key]));
      });
    } else {
      control = new UntypedFormControl(formValue);
    }
    return control;
  }
}
