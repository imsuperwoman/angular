import { AbstractControl, UntypedFormControl, UntypedFormGroup, ValidatorFn, Validators } from '@angular/forms';

class bothZeroValidator {
    static match(controlChildren: string, controlAdults: string, controlSeniors: string, trgrpcode: string): ValidatorFn {
        return (controls: AbstractControl) => {
            const controltrgrpcode = controls.get(trgrpcode);
            const controlC = controls.get(controlChildren);
            const controlA = controls.get(controlAdults);
            const controlS = controls.get(controlSeniors);

            if (controltrgrpcode?.value == 'MT') {

                if (controlC?.value === '0' && controlA?.value === '0' && (controlS?.value === '0' || controlS?.value === '')) {
                    controls.get(controlChildren)?.setErrors({
                        type: 'incorrect',
                        message: 'Select atleast one traveller.'
                    });
                    controls.get(controlAdults)?.setErrors({
                        type: 'incorrect',
                        message: 'Select atleast one traveller.'
                    });
                    if (controlS?.value === '0') {
                        controls.get(controlSeniors)?.setErrors({
                            type: 'incorrect',
                            message: 'Select atleast one traveller.'
                        });
                    }
                    return { type: 'incorrect', message: 'Select atleast one traveller. ' };
                } else {
                    controls.get(controlChildren)?.setErrors(null)
                    controls.get(controlAdults)?.setErrors(null)
                    controls.get(controlSeniors)?.setErrors(null)
                    return null;
                }
            } else if (controltrgrpcode?.value == 'FM') {
                if (controlC?.value === '0' && controlA?.value === '0') {
                    controls.get(controlChildren)?.setErrors({
                        type: 'incorrect',
                        message: 'Select atleast one traveller.'
                    });
                    controls.get(controlAdults)?.setErrors({
                        type: 'incorrect',
                        message: 'Select atleast one traveller.'
                    });
                    return { type: 'incorrect', message: 'Select atleast one traveller. ' };
                } else {
                    controls.get(controlChildren)?.setErrors(null);
                    controls.get(controlAdults)?.setErrors(null);
                    controls.get(controlSeniors)?.setErrors(null);
                    return null;
                }

            }
            return null;
        };
    }
}

export default new UntypedFormGroup({
    tragerange: new UntypedFormControl('', Validators.required),
    coveragetype: new UntypedFormControl('', Validators.required),
    trdestination: new UntypedFormControl('', Validators.required),
    trgrpcode: new UntypedFormControl('', Validators.required),
    startDate: new UntypedFormControl('', Validators.required),
    endDate: new UntypedFormControl(''),
    NoOfChildren: new UntypedFormControl('0'),
    NoOfAdults: new UntypedFormControl('0'),
    NoOfSeniors: new UntypedFormControl('0'),
}, {
    validators: [bothZeroValidator.match('NoOfChildren', 'NoOfAdults', 'NoOfSeniors', 'trgrpcode')]
});

export const SENIOR_COVERAGETYPE_DROPDOWN = [
    { Description: 'one way', Code: 'OW' },
    { Description: 'two way', Code: 'TW' },
];

export const COVERAGETYPE_DROPDOWN = [
    { Description: 'annual', Code: 'AN' },
    { Description: 'one way', Code: 'OW' },
    { Description: 'two way', Code: 'TW' },
];

export const AN_TRDESTINATION_DROPDOWN = [
    { Description: 'domestic', Code: 'DOM' },
    { Description: 'worldwide', Code: 'WRW1' },
];

export const TRDESTINATION_DROPDOWN = [
    { Description: 'Asia', Code: 'ASI' },
    { Description: 'domestic', Code: 'DOM' },
    { Description: 'worldwide', Code: 'WRW1' },
];

export const A_NONAN_TRGYPCODE_DROPDOWN = [
    { Description: 'family', Code: 'FM' },
    { Description: 'myself', Code: 'MS' },
    { Description: 'multiple travellers', Code: 'MT' },
];

export const TRGYPCODE_DROPDOWN = [
    { Description: 'myself', Code: 'MS' },
    { Description: 'multiple travellers', Code: 'MT' },
];

export const PAXNO_ONLYONE_DROPDOWN = [
    { Code: "0", Disabled: false },
    { Code: "1", Disabled: false },
];

export const PAXNO_DROPDOWN =
    [
        { Code: "0", Disabled: false },
        { Code: "1", Disabled: false },
        { Code: "2", Disabled: false },
        { Code: "3", Disabled: false },
        { Code: "4", Disabled: false },
        { Code: "5", Disabled: false },
        { Code: "6", Disabled: false },
        { Code: "7", Disabled: false },
        { Code: "8", Disabled: false },
        { Code: "9", Disabled: false },
        { Code: "10", Disabled: false }
    ]