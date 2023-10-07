import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';

export default new UntypedFormGroup({
    vehicleDetails: new UntypedFormGroup({
        brand: new UntypedFormControl('', Validators.required),
        model: new UntypedFormControl('', Validators.required),
        year: new UntypedFormControl('', Validators.required),
        carType: new UntypedFormControl('', Validators.required),
        SumInsured: new UntypedFormControl(''),
        VehicleEngineCC: new UntypedFormControl(''),
        reconditionedCar: new UntypedFormControl('', Validators.required),
        AvCode: new UntypedFormControl(''),
        comDetails: new UntypedFormGroup({
            capacity: new UntypedFormControl('', Validators.required),
            comCarType: new UntypedFormControl(''),
            comCarTypeDesc: new UntypedFormControl(''),
            comBrand: new UntypedFormControl('', Validators.required),
            comModel: new UntypedFormControl('', Validators.required),
            comBrandDesc: new UntypedFormControl(''),
            comModelDesc: new UntypedFormControl(''),

        }),
    }),
    ownerDetails: new UntypedFormGroup({
        gender: new UntypedFormControl('', Validators.required),
        dob: new UntypedFormControl('', Validators.required),
        status: new UntypedFormControl('', Validators.required),
        age: new UntypedFormControl('')
    }),
    recaptcha: new UntypedFormControl('')
});

export const CONDITIONS_DROPDOWN: any[] = [
    {
        value: 'N',
        label: 'is not',
    },
    {
        value: 'Y',
        label: 'is',
    }
];

export const GENDER = [
    { label: 'Male', value: 'M' },
    { label: 'Female', value: 'F' },
];

export const CONFIRMATION = [
    {
        label: 'Make',
        value: '',
        editing: false,
        controlName: 'comBrand',
        showFilter: true,
        type: 'dropdown'
    },
    {
        label: 'Model',
        value: '',
        editing: false,
        controlName: 'comModel',
        showFilter: true,
        type: 'dropdown'
    },
    {
        label: 'Seating Capacity',
        value: '',
        editing: false,
        controlName: 'capacity',
        showFilter: false,
        type: 'input'
    },
    {
        label: 'Car type',
        value: '',
        editing: false,
        controlName: 'comCarType',
        showFilter: true,
        type: 'dropdown'
    },
];