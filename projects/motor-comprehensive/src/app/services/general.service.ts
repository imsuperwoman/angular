import { Injectable } from '@angular/core';
import { UntypedFormArray, UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})

export class GeneralService {
  constructor() {
  }

  coverageFormControls(formValue: any): any {
    let control: any;
    if (!formValue) {
      control = new UntypedFormControl(formValue);
    } else if (formValue instanceof Array) {
      control = new UntypedFormArray([]);
      formValue.forEach((arrayVal) => {
        control.push(this.coverageFormControls(arrayVal));
      });
    } else if (typeof formValue === 'object') {
      control = new UntypedFormGroup({});
      Object.keys(formValue).forEach((key) => {
        if (key === 'p2pCoverSelection') {
          control.addControl(key, new UntypedFormControl(formValue[key]));
        } else {
          control.addControl(key, this.coverageFormControls(formValue[key]));
        }
      });
    } else {
      control = new UntypedFormControl(formValue);
    }
    return control;
  }
}
