import { ValidationErrors } from "@angular/forms";


export function invalidAlphaNumeric(control: any) {
  if (control.value && (!control.value.match(/^(?=.*?[a-z]{1})(?=(.*[0-9]){1})/i)
    || !control.value.match(/^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/))) {
    return { invalid: true, message: 'Invalid Plate No.' };
  } else if (control.value.length == 0) {
    return { invalid: true, message: 'This field is required. ' };
  } else {
    return null;
  }
}

export function postCodeValidator(postCodeList: any, control: any): ValidationErrors | null {
  if (control.value.length == 0) {
    return { invalid: true, message: 'Please enter postcode number. ' };
  }
  else if (control.value.length > 0 && control.value.length === 5) {
    let postcode = postCodeList.filter((item: any) => item.Postcode == control.value);
    if (postcode.length < 1) {
      return { invalid: true, message: 'Invalid postcode number. ' };
    } else if (postcode[0].FloodProneInd === 'Y') {
      return { invalid: true, message: 'This policy cover is only available for business located in non-flood prone areas. ' };
    }
  } else if (control.value.length > 0 && control.value.length < 5) {
    return { invalid: true, message: 'Invalid postcode number. ' };
  }
  return null;
}

export function postCodeValidatorWithoutFloodProne(postCodeList: any, control: any): ValidationErrors | null {
  if (control.value.length == 0) {
    return { invalid: true, message: 'Please enter postcode number. ' };
  }
  else if (control.value.length > 0 && control.value.length === 5) {
    let postcode = postCodeList.filter((item: any) => item.Postcode == control.value);
    if (postcode.length < 1) {
      return { invalid: true, message: 'Invalid postcode number. ' };
    }
  } else if (control.value.length > 0 && control.value.length < 5) {
    return { invalid: true, message: 'Invalid postcode number. ' };
  }
  return null;
}

export function emailRequiredValidator(control: any) {
  if (control.value.length == 0) {
    return { type: "required", message: 'Please enter email. ' };
  } else if (!control.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
    return { type: "invalid", message: 'Please enter a valid email. ' };
  }
  return null;
}

export function emailValidator(control: any) {
  if (control.value.length == 0) {
    return null;
  } else
    if (!control.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
      return { type: "invalid", message: 'Please enter a valid email. ' };
    }
  return null;
}

export function validateEmailWithoutDomain(control: any) {
  if (!control.value || !control.value.length) {
    return null;
  } else if (control.value && control.value.match(/^\w+([\.-]?\w+)+$/i)) {
    return null;
  } else {
    return { invalid: true, message: 'Please enter a valid email. ' };
  }
}

