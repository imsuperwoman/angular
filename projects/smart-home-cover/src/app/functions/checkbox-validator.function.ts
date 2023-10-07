import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class checkBoxValidator {
  static match(control: any, checkControl: any): ValidatorFn {
    return (controls: AbstractControl) => {

      if (control?.value === true && checkControl?.value === '') {
        checkControl?.setErrors({ type: 'incorrect' })
        return null;
      }
      if (control?.value === false && checkControl?.value === '') {
        checkControl?.setErrors(null)
        return null;
      }
      if (control?.value === false) {
        checkControl?.setValue('')
        return null;
      }
      return null
    }
  }
}