import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export default new UntypedFormGroup({
  mainPolicyHolder: new UntypedFormGroup({
    mainPolicyholderLabel: new UntypedFormControl(''),
    mainPolicyholderSport: new UntypedFormControl(''),
    mainPolicyholderMount: new UntypedFormControl(''),
    mainPolicyholderMountAdultGroup: new UntypedFormControl(''),
    fullname: new UntypedFormControl('', Validators.required),
    idType: new UntypedFormControl('NRIC', Validators.required),
    idNo: new UntypedFormControl('', Validators.required),

    guardianName: new UntypedFormControl('', Validators.required),
    guardianIdType: new UntypedFormControl('NRIC', Validators.required),
    guardianIdNo: new UntypedFormControl('', Validators.required),

    age: new UntypedFormControl(''),
    dob: new UntypedFormControl('', Validators.required),
    gender: new UntypedFormControl('M', Validators.required),
    nationality: new UntypedFormControl('MAL', Validators.required),
    phonePrefix: new UntypedFormControl('+6010', Validators.required),
    phoneNo: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', Validators.required),
    customerEmail : new UntypedFormControl(''),
    address: new UntypedFormGroup({
      line1: new UntypedFormControl('', Validators.required),
      line2: new UntypedFormControl(),
      line3: new UntypedFormControl(),
      postcode: new UntypedFormControl('', Validators.required),
      city: new UntypedFormControl('', Validators.required),
      state: new UntypedFormControl('', Validators.required),
    })
  }),
  mountaineeringForm: new UntypedFormGroup({
    startDate: new UntypedFormControl(''),
    endDate: new UntypedFormControl(''),
  }),
  hsbcCardChecking: new UntypedFormGroup({
    hsbcCardHolder: new UntypedFormControl(''),
    hsbcCardHolderNumber: new UntypedFormControl(''),
  })
});


export const AgeRange: { [key: string]: string } = {
  A: <any>"18-70 years old",
  C: <any>"0-17 years old",
  S: <any>"71-80 years old",
  adult1: <any>"18-40 years old",
  adult2: <any>"41-60 years old",
}

export const FMAgeRange: { [key: string]: string } = {
  A: <any>"18-70 years old",
  C: <any>"0-24 years old",
  S: <any>"71-80 years old",
  adult1: <any>"18-40 years old",
  adult2: <any>"41-60 years old",
}

export const Type: { [key: string]: string } = {
  MTC: <any>"Child",
  MTA: <any>"Adult",
  MTS: <any>"Senior Citizen",
  FMC: <any>"Child",
  FMA: <any>"Spouse",
}

export const TrgrpCode: { [key: string]: string } = {
  MT: <any>"Multiple Travellers",
  FM: <any>"Family",
}


export const ADULT_RELATIONSHIP_DROPDOWN = [
  { Description: 'WIFE', Code: '02' },
  { Description: 'HUSBAND', Code: '03' }
];

export const CHILD_RELATIONSHIP_DROPDOWN = [
  { Description: 'SON', Code: '04' },
  { Description: 'DAUGHTER', Code: '05' }
];