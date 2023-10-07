import { ValidationErrors } from '@angular/forms';
import * as moment from 'moment';


export function nricValidatorWithMinDays(minDays: any, maxAge: any, groupControl: any): ValidationErrors | null {

  let idTypeControl = groupControl?._parent?.controls.idType;
  let idNoControl = groupControl?._parent?.controls.idNo;
  let dobControl = groupControl?._parent?.controls.dob;
  let genderControl = groupControl?._parent?.controls.gender;
  let ageControl = groupControl?._parent?.controls.age;

  let idTypeValue = idTypeControl?.value;
  let idNoValue = idNoControl?.value;
  if (!idTypeControl && !idNoControl) {
    idTypeControl = groupControl.controls.idType;
    idNoControl = groupControl.controls.idNo;
    idTypeValue = idTypeControl?.value;
    idNoValue = idNoControl?.value;
  }

  if (!idNoValue) {
    return ({ type: "required", message: 'Please enter ID no.' });
  }
  if (idTypeValue == 'NRIC') {
    idNoValue = idNoValue.replace(/-/g, '');

    if (idNoValue.length == 0) {
      idNoControl?.setErrors({ required: true });
      dobControl.setValue(null);
      genderControl?.setValue(null);
    }
    else
      if (idNoValue.length < 12) {
        idNoControl?.setErrors({ invalidId: true });
        dobControl?.setValue(null);
        genderControl?.setValue(null);
      }
      else {
        let dateSegments = idNoValue.substring(0, 6).match(/.{1,2}/g);
        let userYear = dateSegments[0];
        let userMonth = dateSegments[1];
        let userDay = dateSegments[2];

        let today = new Date();
        let systemYear = today.getFullYear().toString().substr(-2);
        let systemDay;
        let century;
        let todayYear = today.getFullYear();

        switch (parseInt(userMonth)) {
          case 2: {
            if ((userYear % 4 === 0 && userYear % 100) || (userYear % 400 === 0)) {
              systemDay = 29;
            } else {
              systemDay = 28;
            }
            break;
          }

          case 4: case 6: case 9: case 11: {
            systemDay = 30;
            break;
          }

          default: {
            systemDay = 31;
          }
        }

        parseInt(userYear) > parseInt(systemYear) ? (century = '19') : (century = '20');
        userYear = century + userYear;

        let userDob = new Date(`${userYear}-${dateSegments[1]}-${dateSegments[2]}T00:00:00Z`);
        let myIcFormat =
          /(([[0-9]{2})(0[1-9]|1[0-2])(0[1-9]|[12][0-9]|3[01]))([0-9]{2})([0-9]{4})/g;
        let isValid: boolean = myIcFormat.test(idNoValue);

        var start = moment(new Date());
        var end = moment(userYear + '-' + userMonth + '-' + userDay);
        var diffDays = start.diff(end, "days")

        if (!isValid || parseInt(userDay) > systemDay) {
          idNoControl?.setErrors({ invalidId: true });
          dobControl?.setValue(null);
          genderControl?.setValue(null);
        }
        else if (diffDays < minDays || userYear < todayYear - maxAge) {
          idNoControl?.setErrors({ invalidAgeRange: true });
          dobControl?.setValue(null);
          genderControl?.setValue(null);

        }
        else {
          dobControl?.setValue(userDob);
          ageControl?.setValue(moment().diff(userDob, 'years') + 1);

          let genderNo = idNoValue.slice(-1);
          let gender;
          genderNo % 2 == 0 ? (gender = 'F') : (gender = 'M');
          genderControl?.setValue(gender);
          idNoControl?.setErrors(null);
        }
      }
  }

  if (idNoControl?.getError("required")) {
    return ({ type: "required", message: 'Please enter ID no.' });
  } else if (idNoControl?.getError("invalidId")) {
    return ({ type: "invalidId", message: 'Please enter a valid NRIC.' });
  } else if (idNoControl?.getError("invalidAgeRange")) {
    return ({ type: "invalidAgeRange", message: 'The age eligibility is ' + minDays + ' days to ' + maxAge + ' years old.' });
  }

  return null;
}


export function nricDOB(nricNumber: any) {
  let dateSegments = nricNumber.substring(0, 6).match(/.{1,2}/g);
  let userYear = dateSegments[0];

  let today = new Date();
  let systemYear = today.getFullYear().toString().substr(-2);
  let century;

  parseInt(userYear) > parseInt(systemYear) ? (century = '19') : (century = '20');
  userYear = century + userYear;

  let userDob = new Date(`${userYear}-${dateSegments[1]}-${dateSegments[2]}T00:00:00Z`);

  return userDob;
}
