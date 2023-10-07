import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export default new UntypedFormGroup({
  policyholder: new UntypedFormGroup({
    fullname: new UntypedFormControl('', Validators.required),
    idType: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    idNo: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    dob: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    gender: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    nationality: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    phonePrefix: new UntypedFormControl('+6010', Validators.required),
    phoneNo: new UntypedFormControl('', Validators.required),
    email: new UntypedFormControl('', Validators.required),
    address: new UntypedFormGroup({
      line1: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
      line2: new UntypedFormControl(),
      line3: new UntypedFormControl(),
      postcode: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
      city: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
      state: new UntypedFormControl({ value: '', disabled: true }, Validators.required),
    })
  }),
  ehailingDriver: new UntypedFormGroup({
    fullname: new UntypedFormControl(),
    idType: new UntypedFormControl(),
    idNo: new UntypedFormControl(),
  }),
  additionalDriver: new UntypedFormGroup({
    driver1: new UntypedFormGroup({
      fullname: new UntypedFormControl(),
      idType: new UntypedFormControl(),
      idNo: new UntypedFormControl(),
    }),
    driver2: new UntypedFormGroup({
      fullname: new UntypedFormControl(),
      idType: new UntypedFormControl(),
      idNo: new UntypedFormControl(),
    }),
  }),
   hsbcCardChecking: new UntypedFormGroup({
    hsbcCardHolder: new UntypedFormControl(''),
    hsbcCardHolderNumber: new UntypedFormControl(''),
  })
});
