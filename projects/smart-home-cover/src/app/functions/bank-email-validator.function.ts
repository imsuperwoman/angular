import { AbstractControl, ValidatorFn } from '@angular/forms';

export default class bankEmailValidator {
  static match(control: any, checkControl: any,hasStaffEmail:boolean,domain:any): ValidatorFn {
    return (controls: AbstractControl) => {
      if (control?.errors && checkControl?.errors?.type !== 'incorrect') {
        return null;
      }

      if(hasStaffEmail){
        const custEmail=`${control?.value}${domain}`;
        if(custEmail==checkControl?.value){
          control?.setErrors({ type: 'incorrect', message: `Bank's email address cannot be the same as the policyholder's email address.` });
          checkControl?.setErrors({ type: 'incorrect', message: `Bank's email address cannot be the same as the policyholder's email address.` });
          return { type: 'incorrect', message: `Bank's email address cannot be the same as the policyholder's email address.` };
        }
        else{
          control?.setErrors(null)
          checkControl?.setErrors(null)
          return null
        }
      }
      else{
        if (control?.value == checkControl?.value) {
          control?.setErrors({ type: 'incorrect', message: `Bank's email address cannot be the same as the policyholder's email address.` });
          checkControl?.setErrors({ type: 'incorrect', message: `Bank's email address cannot be the same as the policyholder's email address.` });
          return { type: 'incorrect', message: `Bank's email address cannot be the same as the policyholder's email address.` };
        } else {
          control?.setErrors(null)
          checkControl?.setErrors(null)
          return null;
        }
      }

    }
  }
}