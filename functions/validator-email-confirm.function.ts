import { AbstractControl, ValidatorFn } from "@angular/forms";

export default class emailConfirmValidator {
  static match(controlName: string, checkControlName: string): ValidatorFn {
    return (controls: AbstractControl) => {
      const control = controls.get(controlName);
      const checkControl = controls.get(checkControlName);

      if (checkControl?.errors && checkControl.errors.type !== 'incorrect') {
        return null;
      }

      if (control?.value !== checkControl?.value) {
        controls.get(checkControlName)?.setErrors({ type: 'incorrect', message: 'Email confirmation is not same as email. ' });
        return { type: 'incorrect', message: 'Email confirmation is not same as email. ' };
      } else {
        controls.get(checkControlName)?.setErrors(null)
        return null;
      }
    };
  }
}