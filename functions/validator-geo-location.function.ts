import { AbstractControl, ValidatorFn } from "@angular/forms";

export default class geoLocationValidator {
  static match(addressnumber: any, address1: any): ValidatorFn {
    return (controls: AbstractControl) => {
      const addressnumberC = controls.get(addressnumber);
      const address1C = controls.get(address1);

      if (addressnumberC?.errors && address1C?.errors?.type !== 'incorrect') {
        return null;
      }

      if (address1C?.value.length === 0) {
        return { type: 'incorrect', message: 'Please enter Address line 1.' };
      } else if (address1C?.value.length > 0) {
        if ((addressnumberC?.value.length + address1C?.value.length) > 98) {
          controls.get(address1)?.setErrors({ type: 'incorrect', message: 'Unit number and Address line 1 cannot have more than 98 characters combined.' });
          return { type: 'incorrect', message: 'Unit number and Address line 1 cannot have more than 98 characters combined.' };
        } else {
          controls.get(address1)?.setErrors(null)
          return null;
        }
      }
      else {
        controls.get(address1)?.setErrors(null)
        return null;
      }
    };
  }
}